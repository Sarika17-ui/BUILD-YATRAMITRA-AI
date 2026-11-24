from model import ai_engine
import json

res = ai_engine.predict("somnath", 10)
print("TEST SUCCESS:")
print(json.dumps(res, indent=2, ensure_ascii=False))
