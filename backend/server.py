"""FastAPI server exposing dashboard bundle endpoints."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.dashboard_service import get_dashboard_bundle


def _camelize_bundle(bundle: dict) -> dict:
    summary = bundle["summary"]
    trend = bundle["trend"]
    return {
        "summary": {
            "date": summary["date"],
            "caloriesConsumed": summary["calories_consumed"],
            "calorieGoal": summary["calorie_goal"],
            "systolic": summary["systolic"],
            "diastolic": summary["diastolic"],
            "weight": summary["weight"],
            "exerciseMinutes": summary["exercise_minutes"],
            "hydrationLiters": summary["hydration_liters"],
            "medicationAdherence": summary["medication_adherence"],
            "missedDoses": summary["missed_doses"],
            "steps": summary["steps"],
        },
        "trend": {
            "sevenDay": trend["seven_day"],
            "thirtyDay": trend["thirty_day"],
        },
        "notes": bundle.get(
            "notes",
            [
                "일일 요약과 7/30일 추세를 한 번에 제공하는 번들 API.",
                "LRU 캐시 + TTL로 백엔드 부하를 줄이고 응답 지연을 최소화합니다.",
            ],
        ),
    }


app = FastAPI(title="Health Dashboard API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/dashboard")
def read_dashboard(force_refresh: bool = False):
    """Return the cached dashboard bundle in camelCase for the frontend."""

    bundle = get_dashboard_bundle(force_refresh=force_refresh)
    return _camelize_bundle(bundle)


__all__ = ["app", "read_dashboard"]
