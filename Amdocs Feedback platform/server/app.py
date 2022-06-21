#!/root/miniconda3/envs/amdocs/bin/python

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import dotenv_values
from Database import Database as DB
from uuid import uuid4 as uid
from werkzeug.security import generate_password_hash, check_password_hash
from time import time
from functools import wraps
import jwt

# Cargar variables del ambiente
SECRETS = dotenv_values(".env")

app = Flask(__name__)
CORS(app)
db = DB(path=SECRETS.get("DB_PATH"))
# db = DB(path='C:\\Users\\laloh\\OneDrive - Instituto Tecnologico y de Estudios Superiores de Monterrey\\Desktop\\Uni\\4to Semestre\\Construcción de Software\\GDA.TC2005B.1.2111.11758_Feedback1\\server\\DB.db')


def api_key_required(f):
    """
    Validar el API KEY que se ha mandado dentro del request
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = SECRETS.get("API_KEY", True)
        # api_key = 'prueba'
        headers = request.headers
        try:
            if headers.get('x-api-key', None) == api_key:
                pass
            else:
                return jsonify({"status": "bad", "message": "invalid api key"}), 401
        except:
            return jsonify({"status": "bad", "message": "invalid api key"}), 401
        return f(*args, **kwargs)
    return decorated


def jwt_required(f):
    """
    Validar el JWT que se ha mandado dentro del request
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        
        return f(*args, **kwargs)
    return decorated


@app.route('/test', methods=['GET'])
@api_key_required
def test():
    """Prueba de que funciona el script
    
    Returns:
        JSON: La respuesta que se tiene que regresar a la petición
    """
    return jsonify({"status": "ok"}), 200


@app.route('/areas', methods=['GET'])
@api_key_required
@jwt_required
def get_areas():
    """
    Get de todas la áreas dentro de la base de datos
    """
    # Ejecutar el query dentro de la base de datos
    query = "SELECT * FROM Area"
    data = tuple()
    results = db.exec_query(query=query, data=data)
    
    if results is None:
        return jsonify({"status": "ok", "areas": []}), 200
    
    areas = []
    # Parsear la información
    for area in results:
        areas.append({    
            "_id": str(area[0]),
            "name": str(area[1]),
            "icon": str(area[2]),
            "active": bool(area[3])
        })    
    return jsonify({"status": "ok", "areas": areas}), 200


@app.route('/subarea', methods=['GET'])
@api_key_required
@jwt_required
def get_subarea():
    """
    Get de todas la subareas dentro de la base de datos
    """
    area = request.args.get('area')
    if area is None:
        return jsonify({"status": "bad", "message": "invalid area"}), 400

    # Construir y hacer el query
    query = "SELECT * FROM Subarea WHERE area=?"
    data = (area, )
    results = db.exec_query(query=query, data=data)

    if results is None:
        return jsonify({"status": "ok", "subareas": []}), 200

    subareas = []
    for subarea in results:
        subareas.append({
            '_id': str(subarea[0]),
            'name': str(subarea[1]),
            'active': bool(subarea[2]),
            'area': str(subarea[3])
        })

    return jsonify({"status": "ok", "subareas": subareas}), 200


@app.route('/categories', methods=['GET'])
@api_key_required
@jwt_required
def get_categorias():
    """
    Lista con todos los tipos de tickets disponibles
    """
    # Hacer el query
    query = "SELECT * FROM Categoria"
    data = tuple()
    results = db.exec_query(query=query, data=data)

    if results is None:
        return jsonify({"status": "ok", "categorias": []}), 200

    categorias = []
    for categoria in results:
        categorias.append({
            "_id": str(categoria[0]),
            "name": str(categoria[1]),
            "icon": str(categoria[2]),
            "active": bool(categoria[3])
        })
    return jsonify({"status": "ok", "categories": categorias}), 200


@app.route('/user', methods=['GET'])
@api_key_required
@jwt_required
def get_user():
    """
    Regresar la información de un usuario
    """
    uid = request.args.get('user')
    if uid is None:
        return jsonify({"status": "bad", "message": "invalid user id"}), 400

    # Ejecutar el query
    query = "SELECT * FROM Usuario WHERE _id=?"
    data = (uid, )
    result = db.exec_query(query=query, data=data)

    if result is None or len(result) == 0:
        return jsonify({"status": "ok", "user": None}), 200

    usuario = {
        '_id': str(result[0][0]),
        'nombre': str(result[0][1]),
        'apellido_paterno': str(result[0][2]),
        'apellido_materno': str(result[0][3]),
        'email': str(result[0][4]),
        'is_admin': int(result[0][6]),
        'job_title': str(result[0][7]),
        'phone_number': str(result[0][8])
    }

    return jsonify({"status": "ok", "user": usuario}), 200


@app.route('/tickets', methods=["GET"])
@api_key_required
@jwt_required
def get_tickets():
    """Regresa todos los tickets que correspondan a un usuario de acuerdo a su UID

    Returns:
        JSON: La respuesta que se tiene que regresar a la petición, con una lista de los tickets del usuario
    """
    # Tomar el UID (user id) de la request
    user = request.args.get('user')
    if user is None:
        return jsonify({"status": "bad", "message": "invalid uid"}), 400

    query = "SELECT * FROM Ticket WHERE user=?"
    data = (user, )
    results = db.exec_query(query=query, data=data)

    if results is None:
        return jsonify({"status": "ok", "tickets": []}), 200

    tickets = []
    for ticket in results:
        tickets.append({
            "_id": str(ticket[0]),
            "anonymous": bool(ticket[1]),
            "rating": int(ticket[2]),
            "user": str(ticket[3]),
            "area": str(ticket[4]),
            "sub_area": str(ticket[5]),
            "category": str(ticket[6]),
            "active": bool(ticket[7])
        })

    return jsonify({"status": "ok", "tickets": tickets}), 200



@app.route('/area', methods=["GET"])
@api_key_required
@jwt_required
def get_area():
    """Regresa toda la información de un área en específico

    Returns:
        JSON: La respuesta que se tiene que regresar a la petición, con la información del área que se pidió
    """
    # Tomar el area dentro de los parámetros
    area = request.args.get('area')
    if area is None:
        return jsonify({"status": "bad", "message": "invalid area id"}), 400
    
    query = "SELECT * FROM Area WHERE _id=?"
    data = (area, )
    result = db.exec_query(query=query, data=data)

    if result is None:
        return jsonify({"status": "ok", "area": None}), 400
    
    area = {
        "id": str(result[0][0]),
        "name": str(result[0][1]),
        "icon": str(result[0][2]),
        "active": bool(result[0][3])
    }
    return jsonify({"status": "ok", "area": area}), 200
    

@app.route('/area', methods=["PUT"])
@api_key_required
@jwt_required
def update_area():
    """
    Actualiza la información de un área en específico
    """
    # Sacar el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "no information provided"}), 400
    
    try:
        area = body['area']
        status = int(body['status'])
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400
        
    query = "UPDATE Area SET active=? WHERE _id=?"
    data = (status, area)
    db.exec_query(query=query, data=data)
    
    return jsonify({"status": "ok", "message": "area updated succesfully"}), 200


@app.route('/subarea', methods=["PUT"])
@api_key_required
@jwt_required
def update_subarea():
    """
    Actualiza la información de un subarea en específico
    """
    # Sacar el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "no information provided"}), 400
    
    try:
        subarea = body['subarea']
        status = int(body['status'])
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400

    query = "UPDATE Subarea SET active=? WHERE _id=?"
    data = (status, subarea)
    db.exec_query(query=query, data=data)

    return jsonify({"status": "ok", "message": "subarea updated succesfully"}), 200


@app.route('/category', methods=["PUT"])
@api_key_required
@jwt_required
def update_category():
    """
    Actualizar una categoría dentro de la base de datos
    """
    # Sacar el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "no information provided"}), 400
    
    try:
        category = body['category']
        status = int(body['status'])
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400

    query = "UPDATE Categoria SET active=? WHERE _id=?"
    data = (status, category)
    db.exec_query(query=query, data=data)

    return jsonify({"status": "ok", "message": "Category status updated"}), 200


@app.route('/category', methods=["POST"])
@api_key_required
@jwt_required
def create_category():
    """
    Crea una nueva categoría dentro de la base de datos
    """
    # Extraer el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "no information provided"}), 401
    
    try:
        name = str(body['name'])
        icon = str(body['icon'])
        status = 1
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400

    query = "INSERT INTO Categoria(_id, name, icon, active) VALUES(?,?,?,?)"
    data = (generate_id(), name, icon, status)
    db.exec_query(query=query, data=data)

    return jsonify({"status": "ok", "message": "category created successfully"}), 200


@app.route('/ticket/rating', methods=["PUT"])
@api_key_required
@jwt_required
def update_grade():
    """
    Actualiza la calificación que un usuario le ha dado a una persona de su ticket
    """
    # Tomar el cuerpo del request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "invalid type"}), 400

    try:
        ticket = body['ticket']
        rating = int(body['rating'])
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400

    query = "UPDATE Ticket SET rating=? WHERE _id=?"
    data = (rating, ticket)
    db.exec_query(query=query, data=data)

    return jsonify({"status": "ok", "message": "rating updated succesfully"}), 200


@app.route('/ticket', methods=['POST'])
@api_key_required
@jwt_required
def post_ticket():
    """
    Crea un nuevo ticket dentro de la base de datos
    """
    # Tomar el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "invalid format"}), 400

    try:
        rating = int(body['rating'])
        user = str(body['user'])
        area = str(body['area'])
        sub_area = str(body['sub_area'])
        category = str(body['category'])
        anonymous = int(body['anonymous'])
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400

    query = "INSERT INTO Ticket(_id, anonymous, rating, user, area, sub_area, category, active) VALUES(?,?,?,?,?,?,?,?)"
    _id = generate_id()
    data = (_id, anonymous, rating, user, area, sub_area, category, 1)
    db.exec_query(query=query, data=data)

    return jsonify({"status": "ok", "message": "ticket created succesfully", "ticket": _id}), 200


@app.route('/signup', methods=["POST"])
@api_key_required
def sign_up():
    """
    Registrar un nuevo usuario
    """
    # Extraer el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "no information provided"}), 401
    
    try:
        _id = generate_id()
        nombre = str(body['nombre'])
        apellido_paterno = str(body['apellido_paterno'])
        apellido_materno = str(body['apellido_materno'])
        email = str(body['email'])
        password = generate_password_hash(body['password'])
        is_admin = int(body['is_admin'])
        job_title = str(body['job_title'])
        phone_number = str(body['phone_number'])

        if is_admin not in [0, 2]:
            return jsonify({"status": "bad", "message": "is_admin can only be 0 or 2"}), 400

        query = "SELECT email FROM Usuario WHERE email=?"
        data = (email, )
        result = db.exec_query(query=query, data=data)
        if result != []:
            return jsonify({"status": "bad", "message": "email already in use"}), 400

        query = "INSERT INTO Usuario(_id, nombre, apellido_paterno, apellido_materno, email, password, is_admin, job_title, phone_number) VALUES(?,?,?,?,?,?,?,?,?)"
        data = (_id, nombre, apellido_paterno, apellido_materno, email, password, is_admin, job_title, phone_number)
        db.exec_query(query=query, data=data)
    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400


    return jsonify({"status": "ok", "message": "user created successfully"}), 200


@app.route('/login', methods=["POST"])
@api_key_required
def login():
    """
    Iniciar sesión para un usuario
    """
    # Extraer el cuerpo de la request
    try:
        body = request.get_json()
    except:
        return jsonify({"status": "bad", "message": "no information provided"}), 401
    
    try:
        email = str(body['email'])
        password = str(body['password'])

        query = "SELECT _id, password, is_admin FROM Usuario WHERE email=?"
        data = (email, )
        result = db.exec_query(query=query, data=data)

        res_body = {}
        res_body['id'], true_password, res_body['is_admin'] = result[0]
        if result == []:
            return jsonify({"status": "bad", "message": "email not found"}), 400

    except:
        return jsonify({"status": "bad", "message": "missing data"}), 400

    if (check_password_hash(str(true_password), password)):
        token = jwt.encode(res_body, SECRETS.get("TOKEN_SEED", None), algorithm="HS256")
        return jsonify({"status": "ok", "message": "logged in", "token": token}), 200
    else:
        return jsonify({"status": "bad", "message": "wrong password"}), 401


@app.route('/messages', methods=['GET'])
@api_key_required
@jwt_required
def get_messages():
    """
    Regresar todos los mensajes dependiendo del ID del ticket que se mande
    """
    ticket = request.args.get('ticket')
    if ticket is None:
        return jsonify({"status": "bad", "message": "no ticket provided"}), 400
    
    # Ejecutar el query
    query = "SELECT * FROM Mensaje WHERE ticket=?"
    data = (ticket, )
    results = db.exec_query(query=query, data=data)
    
    if results is None:
        return jsonify({"status": "bad", "messages": []}), 200
    
    messages = []
    for mensaje in results:
        messages.append({
            "id": str(mensaje[0]),
            "timestamp": int(mensaje[1]),
            "text": str(mensaje[2]),
            "from_user": bool(mensaje[3]),
            "ticket": str(mensaje[4])
        })
    return jsonify({"status": "ok", "messages": messages}), 200
    
    
@app.route('/message', methods=['POST'])
@api_key_required
@jwt_required
def post_message():
    """
    Regresar todos los mensajes dependiendo del ID del ticket que se mande
    """
    try:
        body = request.get_json()
        timestamp = int(time())
        text = str(body['text'])
        from_user = int(body['from_user'])
        ticket = str(body['ticket'])
    except:
        return jsonify({"status": "bad", "message": "missing or invalid data"}), 400
    
    query = "INSERT INTO Mensaje(timestamp, text, from_user, ticket) VALUES(?,?,?,?)"
    data = (timestamp, text, from_user, ticket)
    db.exec_query(query=query, data=data)
    
    return jsonify({"status": "ok", "message": "message added succesfully"}), 200


@app.route('/area', methods=['POST'])
@api_key_required
@jwt_required
def post_area():
    """
    Agrega un nuevo área a la base de datos
    """
    try:
        body = request.get_json()
        _id = generate_id()
        name = str(body['name'])
        icon = str(body['icon'])
        active = 1
    except:
        return jsonify({"status": "bad", "message": "missing or invalid data"}), 400
    
    query = "INSERT INTO Area(_id, name, icon, active) VALUES(?,?,?,?)"
    data = (_id, name, icon, active)
    db.exec_query(query=query, data=data)
    
    return jsonify({"status": "ok", "message": "area added succesfully"}), 200


@app.route('/subarea', methods=['POST'])
@api_key_required
@jwt_required
def post_subarea():
    """
    Agrega un nuevo sub-area a la base de datos
    """
    try:
        body = request.get_json()
        _id = generate_id()
        name = str(body['name'])
        active = 1
        area = str(body['area'])
    except:
        return jsonify({"status": "bad", "message": "missing or invalid data"}), 400
    
    query = "INSERT INTO Subarea(_id, name, active, area) VALUES(?,?,?,?)"
    data = (_id, name, active, area)
    db.exec_query(query=query, data=data)
    
    return jsonify({"status": "ok", "message": "subarea added succesfully"}), 200


@app.route('/ticket', methods=['PUT'])
@api_key_required
@jwt_required
def update_ticket():
    """
    Actualiza si es válido un ticket
    """
    try:
        body = request.get_json()
        _id = str(body['_id'])
        active = int(body['active'])
    except:
        return jsonify({"status": "bad", "message": "missing or invalid data"}), 400
    
    query = "UPDATE Ticket SET active=? WHERE _id=?"
    data = (active, _id)
    db.exec_query(query=query, data=data)
    
    return jsonify({"status": "ok", "message": "ticket updated succesfully"}), 200


@app.route('/tickets/admin', methods=['GET'])
@api_key_required
@jwt_required
def get_tickets_by_area():
    """
    Tomar todos los tickets de un administrador de área
    """
    uid = request.args.get('uid')
    if uid is None:
        return jsonify({"status": "bad", "message": "no area provided"}), 400
    
    # Tomar todos los tickets que correspondan al area a donde pertenece la persona
    query = "select * from Ticket where area=(select area from Administrador_area where _id=?)"
    data = (uid, )
    results = db.exec_query(query=query, data=data)
    
    if results is None:
        return jsonify({"status": "bad", "tickets": []}), 200

    tickets = []
    for ticket in results:

        # Ejecutar el query
        query = "SELECT nombre, apellido_paterno FROM Usuario WHERE _id=?"
        data = (str(ticket[3]), )
        user = db.exec_query(query=query, data=data)

        tickets.append({
            "_id": str(ticket[0]),
            "anonymous": bool(ticket[1]),
            "rating": int(ticket[2]),
            "user": str(user[0][0] + ' ' + user[0][1]),
            "area": str(ticket[4]),
            "sub_area": str(ticket[5]),
            "category": str(ticket[6]),
            "active": bool(ticket[7])
        })

    return jsonify({"status": "ok", "tickets": tickets}), 200


@app.route('/users', methods=['GET'])
@api_key_required
@jwt_required
def get_all_users():
    """
    Regresa todos los usarios de la plataforma
    """
    
    # Tomar todos los tickets que correspondan al area a donde pertenece la persona
    query = "select * from Usuario"
    data = tuple()
    results = db.exec_query(query=query, data=data)
    
    if results is None:
        return jsonify({"status": "bad", "users": []}), 200

    users = []
    for user in results:
        users.append({
            '_id': str(user[0]),
            'nombre': str(user[1]),
            'apellido_paterno': str(user[2]),
            'apellido_materno': str(user[3]),
            'email': str(user[4]),
            'is_admin': int(user[6]),
            'job_title': str(user[7]),
            'phone_number': str(user[8])
        })

    return jsonify({"status": "ok", "users": users}), 200


@app.route('/admins', methods=['GET'])
@api_key_required
@jwt_required
def get_current_admins():
    """
    Regresa los administradores actuales
    """
    
    # Tomar todos los tickets que correspondan al area a donde pertenece la persona
    query = "select * from Administrador_area"
    data = tuple()
    results = db.exec_query(query=query, data=data)
    
    if results is None:
        return jsonify({"status": "bad", "users": []}), 200

    admins = []
    for admin in results:
        admins.append({
            "user": str(admin[0]),
            "area": str(admin[1])
        })

    return jsonify({"status": "ok", "admins": admins}), 200
    

@app.route('/admin', methods=['PUT'])
@api_key_required
@jwt_required
def update_current_admins():
    """
    Actualiza los administradores actuales
    """

    try:
        body = request.get_json()
        user = str(body['user'])
        area = str(body['area'])
    except:
        return jsonify({"status": "bad", "message": "missing or invalid data"}), 400
    else:
        if user is None or area is None:
            return jsonify({"status": "bad", "message": "null values passed"}), 400
    
    # Actualizar los valores
    query = "UPDATE Usuario SET is_admin=0 WHERE _id=(SELECT _id from Administrador_area WHERE area=?)"
    data = (area, )
    results = db.exec_query(query=query, data=data)

    query = "delete from Administrador_area where area=? or _id=?"
    data = (area, user)
    results = db.exec_query(query=query, data=data)


    query = "insert into Administrador_area values(?,?)"
    data = (user, area)
    results = db.exec_query(query=query, data=data)
    
    query = "UPDATE Usuario SET is_admin=1 WHERE _id=?"
    data = (user, )
    results = db.exec_query(query=query, data=data)
    

    # Tomar todos los tickets que correspondan al area a donde pertenece la persona
    query = "select * from Administrador_area"
    data = tuple()
    results = db.exec_query(query=query, data=data)
    
    if results is None:
        return jsonify({"status": "ok", "admins": []}), 200

    admins = []
    for admin in results:
        admins.append({
            "user": str(admin[0]),
            "area": str(admin[1])
        })

    return jsonify({"status": "ok", "admins": admins}), 200

@app.route('/grafica/rating', methods=['GET'])
def avgRating():
    area = request.args.get('area')
    #Si es general
    if area is None:
        query = "SELECT AVG(rating) FROM Ticket WHERE rating > 0"
        data = tuple()
        result = db.exec_query(query=query, data=data)

        if result is None:
            return jsonify({"status": "ok", "average": None}), 200

    #Si es de un area en particular
    else:
        query = "SELECT AVG(rating) FROM Ticket WHERE area=? AND rating > 0"
        data = (area, )
        result = db.exec_query(query=query, data=data)

        if result is None:
            return jsonify({"status": "ok", "average": None}), 200

    return jsonify({"status": "ok", "average": result}), 200

@app.route('/grafica/area/quantity', methods=['GET'])
def quantityAreaTickets():

    query = "select x.count, Area.name from (SELECT COUNT(*) as count, area FROM Ticket GROUP BY area) as x JOIN Area on x.area=Area._id"
    data = tuple()
    result = db.exec_query(query=query, data=data)

    if result is None:
        return jsonify({"status": "ok", "quantity": None}), 200

    return jsonify({"status": "ok", "quantity": result}), 200

    
@app.errorhandler(404)
def resource_not_found(e):
    """Página no encontrada

    Args:
        e (Error): Error de página no encontrada

    Returns:
        JSON: La respuesta que se tiene que regresar a la petición
    """
    return jsonify(error=str(e)), 404


def generate_id() -> str:
    """
    Genera un nuevo ID
    """
    return str(uid())


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(SECRETS.get("PORT")), ssl_context=(SECRETS.get("SSL_CERT_PATH"), SECRETS.get("SSL_KEY_PATH")))
    # app.run(debug=True)
