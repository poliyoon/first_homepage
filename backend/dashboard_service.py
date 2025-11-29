"""Dashboard aggregation service.

Provides cached bundle endpoints for daily summary and 7/30-day trend data.
"""

from datetime import date, datetime, timedelta
from functools import lru_cache
from typing import Dict, List, TypedDict

CACHE_TTL_SECONDS = 300
_cached_bundle: Dict[str, object] | None = None
_cached_at: datetime | None = None


class DailySummary(TypedDict):
    date: str
    calories_consumed: int
    calorie_goal: int
    systolic: int
    diastolic: int
    weight: float
    exercise_minutes: int
    hydration_liters: float
    medication_adherence: float
    missed_doses: int
    steps: int


class TrendPoint(TypedDict):
    date: str
    systolic: int
    diastolic: int
    weight: float
    calories: int


class TrendBundle(TypedDict):
    seven_day: List[TrendPoint]
    thirty_day: List[TrendPoint]


class BundleResponse(TypedDict):
    summary: DailySummary
    trend: TrendBundle
    notes: List[str]


def _format_date(target: date) -> str:
    return target.isoformat()


def _generate_trend(days: int, base: TrendPoint) -> List[TrendPoint]:
    points: List[TrendPoint] = []
    for offset in range(days):
        day = date.today() - timedelta(days=(days - offset - 1))
        modifier = (offset % 4) * 1.2
        points.append(
            {
                "date": _format_date(day),
                "systolic": int(base["systolic"] + modifier),
                "diastolic": int(base["diastolic"] + modifier * 0.5),
                "weight": round(base["weight"] + modifier * 0.08, 1),
                "calories": int(base["calories"] + modifier * 15),
            }
        )
    return points


@lru_cache(maxsize=64)
def get_daily_summary(target_date: str) -> DailySummary:
    """Return cached daily summary for a given date string (ISO format)."""

    today_baseline: DailySummary = {
        "date": target_date,
        "calories_consumed": 1920,
        "calorie_goal": 2000,
        "systolic": 138,
        "diastolic": 86,
        "weight": 68.4,
        "exercise_minutes": 45,
        "hydration_liters": 2.1,
        "medication_adherence": 0.92,
        "missed_doses": 1,
        "steps": 8400,
    }
    return today_baseline


def get_trend_bundle() -> TrendBundle:
    base_point: TrendPoint = {
        "date": _format_date(date.today()),
        "systolic": 134,
        "diastolic": 82,
        "weight": 68.5,
        "calories": 1880,
    }
    return {
        "seven_day": _generate_trend(7, base_point),
        "thirty_day": _generate_trend(30, base_point),
    }


def get_dashboard_bundle(force_refresh: bool = False) -> BundleResponse:
    """Return cached dashboard bundle with optional cache bypass."""

    global _cached_bundle, _cached_at
    now = datetime.utcnow()
    if (
        not force_refresh
        and _cached_bundle
        and _cached_at
        and (now - _cached_at) < timedelta(seconds=CACHE_TTL_SECONDS)
    ):
        return _cached_bundle  # type: ignore[return-value]

    today = _format_date(date.today())
    bundle: BundleResponse = {
        "summary": get_daily_summary(today),
        "trend": get_trend_bundle(),
        "notes": [
            "일일 요약과 7/30일 추세를 한 번에 제공하는 번들 API.",
            "LRU 캐시 + TTL로 백엔드 부하를 줄이고 응답 지연을 최소화합니다.",
        ],
    }
    _cached_bundle = bundle
    _cached_at = now
    return bundle


__all__ = [
    "get_daily_summary",
    "get_trend_bundle",
    "get_dashboard_bundle",
]
