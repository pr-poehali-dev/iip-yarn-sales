"""
API магазина IIP: товары и заказы.
Маршрут передаётся через ?route=products или ?route=orders или ?route=orders/5/status
"""

import json
import os
import psycopg2

SCHEMA = "t_p99927583_iip_yarn_sales"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status, body, headers=None):
    h = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
    if headers:
        h.update(headers)
    return {"statusCode": status, "headers": h, "body": json.dumps(body, ensure_ascii=False, default=str)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
            "Access-Control-Max-Age": "86400"
        }, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    route = qs.get("route", "products")
    parts = route.strip("/").split("/")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    admin_key = (event.get("headers") or {}).get("X-Admin-Key", "")
    is_admin = admin_key == os.environ.get("ADMIN_KEY", "iip-admin-2026")

    # --- PRODUCTS ---
    if parts[0] == "products":
        product_id = parts[1] if len(parts) > 1 and parts[1].isdigit() else None

        if method == "GET":
            conn = get_conn()
            cur = conn.cursor()
            if product_id:
                cur.execute(
                    f"SELECT id, name, fiber, weight, price_num, color, tag, in_stock FROM {SCHEMA}.products WHERE id = %s",
                    (product_id,)
                )
                r = cur.fetchone()
                conn.close()
                if not r:
                    return resp(404, {"error": "Не найдено"})
                return resp(200, {"id": r[0], "name": r[1], "fiber": r[2], "weight": r[3],
                                  "priceNum": r[4], "color": r[5], "tag": r[6], "inStock": r[7]})
            cur.execute(
                f"SELECT id, name, fiber, weight, price_num, color, tag, in_stock FROM {SCHEMA}.products ORDER BY id"
            )
            rows = cur.fetchall()
            conn.close()
            products = [{"id": r[0], "name": r[1], "fiber": r[2], "weight": r[3],
                         "priceNum": r[4], "price": f"{r[4]} ₽",
                         "color": r[5], "tag": r[6], "inStock": r[7]} for r in rows]
            return resp(200, products)

        if method == "POST":
            if not is_admin:
                return resp(403, {"error": "Нет доступа"})
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO {SCHEMA}.products (name, fiber, weight, price_num, color, tag) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                (body.get("name"), body.get("fiber"), body.get("weight"),
                 body.get("priceNum"), body.get("color", "#F03E6E"), body.get("tag", ""))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            conn.close()
            return resp(201, {"id": new_id, "message": "Товар создан"})

        if method == "PUT" and product_id:
            if not is_admin:
                return resp(403, {"error": "Нет доступа"})
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"UPDATE {SCHEMA}.products SET name=%s, fiber=%s, weight=%s, price_num=%s, color=%s, tag=%s, in_stock=%s WHERE id=%s",
                (body.get("name"), body.get("fiber"), body.get("weight"),
                 body.get("priceNum"), body.get("color"), body.get("tag", ""),
                 body.get("inStock", True), product_id)
            )
            conn.commit()
            conn.close()
            return resp(200, {"message": "Обновлено"})

        if method == "DELETE" and product_id:
            if not is_admin:
                return resp(403, {"error": "Нет доступа"})
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"DELETE FROM {SCHEMA}.products WHERE id = %s", (product_id,))
            conn.commit()
            conn.close()
            return resp(200, {"message": "Удалено"})

    # --- ORDERS ---
    if parts[0] == "orders":
        order_id = parts[1] if len(parts) > 1 and parts[1].isdigit() else None

        if method == "GET":
            if not is_admin:
                return resp(403, {"error": "Нет доступа"})
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"""
                SELECT id, customer_name, phone, email, city, address,
                       delivery, payment, comment, items, total, status, created_at
                FROM {SCHEMA}.orders ORDER BY created_at DESC
            """)
            rows = cur.fetchall()
            conn.close()
            orders = [{
                "id": r[0], "customerName": r[1], "phone": r[2], "email": r[3],
                "city": r[4], "address": r[5], "delivery": r[6], "payment": r[7],
                "comment": r[8], "items": r[9], "total": r[10], "status": r[11],
                "createdAt": r[12]
            } for r in rows]
            return resp(200, orders)

        if method == "POST":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"""INSERT INTO {SCHEMA}.orders
                    (customer_name, phone, email, city, address, delivery, payment, comment, items, total)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                (body.get("customerName"), body.get("phone"), body.get("email", ""),
                 body.get("city", ""), body.get("address", ""),
                 body.get("delivery", "cdek"), body.get("payment", "card"),
                 body.get("comment", ""),
                 json.dumps(body.get("items", []), ensure_ascii=False),
                 body.get("total", 0))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            conn.close()
            return resp(201, {"id": new_id, "message": "Заказ создан"})

        if method == "PUT" and order_id:
            if not is_admin:
                return resp(403, {"error": "Нет доступа"})
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.orders SET status=%s WHERE id=%s", (body.get("status", "new"), order_id))
            conn.commit()
            conn.close()
            return resp(200, {"message": "Статус обновлён"})

    return resp(404, {"error": "Маршрут не найден"})
