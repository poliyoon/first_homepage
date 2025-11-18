"""Utility to crawl Coupang search results using Playwright.

This file contains a corrected version of the sample shared in the task prompt.
"""

from __future__ import annotations

import time
from typing import Dict, List
from urllib.parse import quote

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError, sync_playwright

BASE_URL = "https://www.coupang.com"
PRODUCT_SELECTORS = [
    "li.search-product",
    "ul.search-product-list > li",
    "li[data-product-id]",
]
NAME_SELECTORS = [
    "div.name",
    "a.search-product-link div.name",
    "div[class*='name']",
    "a.search-product-link",
]
PRICE_SELECTORS = [
    "strong.price-value",
    "span.price-value",
    "strong[class*='price']",
    "span[class*='price']",
]
RATING_SELECTORS = [
    "em.rating",
    "span.rating",
    "em[class*='rating']",
    "span[class*='rating']",
]
RATING_COUNT_SELECTORS = [
    "span.rating-total-count",
    "em.rating-total-count",
    "span[class*='rating-total']",
    "em[class*='rating-total']",
]
LINK_SELECTORS = [
    "a.search-product-link",
    "a[href*='/products/']",
    "a[class*='product-link']",
]
IMAGE_SELECTORS = [
    "img.search-product-wrap-img",
    "img[class*='product-image']",
    "img[class*='product-img']",
    "img[data-img-src]",
]


def _normalize_url(url: str) -> str:
    if not url:
        return ""
    if url.startswith("http"):
        return url
    if url.startswith("//"):
        return f"https:{url}"
    return f"{BASE_URL}{url}" if url.startswith("/") else url


def _wait_for_search_results(page) -> None:
    """Ensure the search grid is rendered before scraping.

    The original script attempted to query all products immediately after `goto`,
    which often happened before Coupang finished rendering the results.  That
    caused either empty results or `TimeoutError` when `networkidle` never
    occurred due to anti-bot checks.  Waiting on a visible product fixes both
    issues.
    """

    last_error: PlaywrightTimeoutError | None = None
    for selector in PRODUCT_SELECTORS:
        try:
            page.wait_for_selector(selector, timeout=20000, state="visible")
            return
        except PlaywrightTimeoutError as exc:  # pragma: no cover - network specific
            last_error = exc
    if last_error:
        raise last_error


def _extract_first_text(handle, selectors: List[str], default: str) -> str:
    for selector in selectors:
        target = handle.query_selector(selector)
        if target:
            return target.inner_text().strip()
    return default


def _extract_link(handle) -> str:
    for selector in LINK_SELECTORS:
        link = handle.query_selector(selector)
        if link:
            href = link.get_attribute("href") or ""
            normalized = _normalize_url(href)
            if normalized:
                return normalized
    return ""


def _extract_image(handle) -> str:
    for selector in IMAGE_SELECTORS:
        img = handle.query_selector(selector)
        if img:
            for attr in ("src", "data-img-src", "data-lazy-src"):
                src = img.get_attribute(attr)
                if src:
                    return _normalize_url(src)
    return ""


def get_coupang_products(keyword: str, max_items: int = 10) -> List[Dict[str, str]]:
    encoded_keyword = quote(keyword)
    url = f"{BASE_URL}/np/search?q={encoded_keyword}&channel=user"
    products: List[Dict[str, str]] = []

    with sync_playwright() as p:  # pragma: no cover - requires Playwright runtime
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1920, "height": 1080},
            locale="ko-KR",
            extra_http_headers={
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            },
        )
        page = context.new_page()

        try:
            page.goto(url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_load_state("networkidle")
            _wait_for_search_results(page)

            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(1.5)
            page.evaluate("window.scrollTo(0, 0)")

            product_items = []
            for selector in PRODUCT_SELECTORS:
                product_items = page.query_selector_all(selector)
                if product_items:
                    break

            for idx, item in enumerate(product_items[:max_items]):
                name = _extract_first_text(item, NAME_SELECTORS, "상품명 없음")
                price = _extract_first_text(item, PRICE_SELECTORS, "가격 정보 없음")
                rate = _extract_first_text(item, RATING_SELECTORS, "평점 없음")
                rate_count = _extract_first_text(
                    item, RATING_COUNT_SELECTORS, "평점 수 없음"
                )
                link = _extract_link(item) or "링크 없음"
                image = _extract_image(item) or "이미지 없음"

                products.append(
                    {
                        "name": name,
                        "price": price,
                        "rate": rate,
                        "rate_count": rate_count,
                        "link": link,
                        "image": image,
                    }
                )
                print(f"  [{idx + 1}] {name[:50]}...")

        finally:
            context.close()
            browser.close()

    return products


def print_products(products: List[Dict[str, str]]) -> None:
    if not products:
        print("검색 결과가 없습니다.")
        return

    print("\n" + "=" * 80)
    print(f"총 {len(products)}개의 상품을 찾았습니다.")
    print("=" * 80 + "\n")

    for idx, product in enumerate(products, 1):
        print(f"[{idx}] {product['name']}")
        print(f"    가격: {product['price']}")
        print(f"    평점: {product['rate']} ({product['rate_count']})")
        print(f"    링크: {product['link']}")
        print(f"    이미지: {product['image']}")
        print("-" * 80)


def main() -> None:
    print("=" * 80)
    print("쿠팡 상품 검색 크롤러 (Playwright)")
    print("=" * 80)

    while True:
        keyword = input("\n검색할 키워드를 입력하세요 (종료: 'q' 또는 'quit'): ").strip()

        if keyword.lower() in {"q", "quit", "종료"}:
            print("프로그램을 종료합니다.")
            break

        if not keyword:
            print("키워드를 입력해주세요.")
            continue

        print(f"\n'{keyword}' 검색 중...")
        products = get_coupang_products(keyword, max_items=10)
        print_products(products)


if __name__ == "__main__":
    main()
