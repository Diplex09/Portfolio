import sys
import traceback
from time import time
import sqlite3
from sqlite3 import Error

class Database:
    def __init__(self, path: str):
        if path is None:
            raise ValueError("Database path must be a string")
        self.path = path

    def exec_query(self, query: str, data: tuple):
        """
        Ejecuta una query dentro de la base de datos. Esto asegura que siempre se ejecute de manera adecuada, además
            de que se cierre correctamente la base de datos.
        :param query: La query que se quiere realizar
        :param data: Los datos que se le quieren pasar a la query
        :return: Los datos que se han regresado de la base de datos al ejecutar la operación
        """
        connection = self._sql_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, data)
            result = cursor.fetchall()
            connection.commit()
        except sqlite3.Error as er:
            result = None
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))
        connection.close()
        return result

    def _sql_connection(self):
        """
        Crea la conexión con la base de datos y la devuelve para poder trabajar en ella
        :return: La conexión con la base de datos para poder trabajar en ella
        """
        try:
            con = sqlite3.connect(self.path)
            return con
        except Error:
            print(Error)
