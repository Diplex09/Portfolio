"""
Reto de crear 3 juegos
Mind Meister - Pablo Blanco - A01637761
Mathventure - Sebastián Rojas - A01637557
Memorama - Aldo Degollado - A01638391
"""
import random
import operator
import os
import sys
import copy

#----------------- MIND MEISTER --------------------------------------------

def ordenNumeros(): #Está función crea aleatoriamente el código de 4 dígitos que tienes que descubrir en el juego
    lista = [random.randint(1,6),random.randint(1,6),random.randint(1,6),random.randint(1,6)]
    return lista

def bienvenida(): #Ésta función imprime la bienvenida del juego, instrucciones y objetivos
    print("""
                                                          --------------------------------
                                                          --- Bienvenido a Master-Mind ---
                                                          --------------------------------
    Un juego que desarrollará tu destreza mental!
    
    OBJETIVO:
        Hay una serie de 4 dígitos que tienes que descifrar. Cada dígito solo puede ser un número del 1 al 6.
        Puede haber más de un número igual en la serie por descubrir.
        
        Sólo vas a tener 10 intentos.
        
        Al dar ENTER vas a recibir una serie de regreso con tu calificación donde vendran 3 posibles letras:
        
        C significa que algún número de tu serie si está en la serie por descubrir, pero no en el lugar correcto.
        L significa que algún número de tu serie si está en la serie por descubrir, y también está en el lugar correcto.
        X significa que algún número de tu serie no está en la serie por descubrir.
        
    IMPORTANTE: Solo son válidos los números del 1 al 6.
                La calificación no la recibirás en el lugar respectivo que se te corrigió, eso lo tendrás que averiguar tú.
    
                                                                        
                                                                        
                                                                        ¡A jugar!
    """)
  


        
        
def volverJugar():  #Ésta función te da la opción de si perdiste volver a jugar
    while True:
        opc = input("Si quieres volver a jugar presiona la tecla '1', si quieres salir presiona la tecla '2':  ")
        if (opc == '1') or (opc == '2'):
            break
        else:
            print('Opción no válida')
            print('')
            
    return opc
        
valid = [1,2,3,4,5,6] #Define los números válidos como entradas
respuesta = []
check1 = ['','','','']
intento = 0

def answer(): #Ésta función heca que los números de entrada sean válidos y crea una copia de las entradas
    global respuesta
    lista = []
    for i in range(4):
        n = int(input(f'Escribe el número que quieres meter en la posición {i+1}:  '))
        while n not in valid:
            print('Por favor escoja un número del 1 al 6')
            n = int(input(f'Escribe el número que quieres meter en la posición {i+1}:  '))
        lista.append(n)
        lista2 = copy.copy(lista)
    respuesta.append(lista2)
    
def checar(resp, correcto): #Ésta función es la más importante del juego, es la que te califica tu serie comparándola con la correcta
    lcompar = copy.copy(correcto)
    lresp = copy.copy(resp)
    cont = 0
    global chec1, checarP
    check = copy.copy(check1)
    for j in range(len(lresp)):
        if lresp[j]==lcompar[j]:
            lresp[j]='0'
            lcompar[j]='0'
            cont += 1
    while '0' in resp:
        lresp.remove('0')
    while '0' in lcompar:
        lcompar.remove('0')
    for i in range(cont):
        check[i]='L'
    cont2 = cont
    for h in range(len(lresp)):
        if lresp[h] in lcompar:
            cont2 += 1
            a = lresp[h]
            lresp[h]='0'
            lcompar.remove(a)
    while '0' in resp:
        lresp.remove('0')
    for i in range(cont, cont2):
        check[i]='C'
    for i in range(cont2, 4):
        check[i]='X'
    checarP.append(check)
    
def now(): #Ésta función te permite ver tus intentos y calificaciones pasadas
    global checarP, respuesta, n
    for i in range(len(checarP)):
        print(n[i], end='              ')
        print(respuesta[i], end='     ')
        print(checarP[i])
        
def cls(): #Ésta función te 'limpia' la pantalla
    for i in range(100):
        print('\n')

def recordatorio():  #Te recuerda que valen las respuestas e instrucciones
    print("""
        C significa que algún número de tu serie si está en la serie por descubrir, pero no en el lugar correcto.
        L significa que algún número de tu serie si está en la serie por descubrir, y también está en el lugar correcto.
        X significa que algún número de tu serie no está en la serie por descubrir.
        
        Se pueden repetir números en la serie.
        El que haya una 'L' en la serie de calificación no significa que el número de esa posición este correcto,
           sino que alguno de tu serie es correcto.
        """)


checarP = []
n = [1,2,3,4,5,6,7,8,9,10]

def mindMeister():
    while True:
        correctoCopia = []
        cls()
        intento = 0
        bienvenida()
        correcto = ordenNumeros()
        correctoCopia.clear()
        correctoCopia = copy.copy(correcto)
        x = input('Presiona ENTER para continuar:  ')
        while x!='':
            x = input('Presiona ENTER para continuar:  ')
        for i in range(10):
            cls()
            recordatorio()
            print("")
            print("")
            print(f'Te quedan {10-intento} intentos.')
            print('# intento       respuesta        calificación')
            print("")
            if intento != 0:
                now()
            print("")
            answer()
            if respuesta[i] == correcto:
                print('GANASTE!!!!')
                print('Tu respuesta ha sido correcta.')
                print('FIN DEL JUEGO')
                break
            checar(respuesta[i], correctoCopia)
            intento += 1
        print("")
        if intento == 10:
            print('PERDISTE!!!')

        print("")
        print("")
        opc = volverJugar()
        if opc == '2':
            break
        elif opc== '1':
            checarP.clear()
            respuesta.clear()
            
# --------------------------------------- MATHVENTURE --------------------------


def mathventure():
    cls()
    vida=3
    #Genera el problema por medio de un diccionario y randoms
    def generador_problema(hoja2):
        operators = {
            '+': operator.add,
            '-': operator.sub,
            '*': operator.mul,
            '/': operator.floordiv,
        }
        num1 = random.randint(1,10)
        num2 = random.randint(1,10)
        operacion = random.choice(list(operators.keys()))
        respuesta = operators.get(operacion)(num1,num2)
        print(f'¿Qué da {num1} {operacion} {num2}?')
        pregunta=(f'¿Qué da {num1} {operacion} {num2}?')
        hoja_preguntas(hoja2,pregunta)
        return respuesta

    #Compara el problema con un input del usuario
    def preguntar_respuesta(hoja,hoja2):
        respuesta = generador_problema(hoja2)
        hoja_respuestas(hoja,respuesta)
        respuestaj = int(input())
        return respuesta == respuestaj

    #Al ser llamada limpia el shell
    def clear_screen():
        os.system("cls" if os.name == "nt" else "clear")
    
    #Genera una matriz vacia para irla llenando de las respuestas correctas
    def choja_respuestas(d):
        matriz=[]
        return matriz
    #Genera una matriz vacia para irla llenando de las preguntas
    def choja_preguntas(d):
        matriz2=[]
        return matriz2
    #Llena la hoja de respuestas
    def hoja_respuestas(m,r):
        matriz=m.append(r)
        return matriz
    #Llena la hoja de preguntas
    def hoja_preguntas(m,r):
        matriz2=m.append(r)
        return matriz2
    #Decide la dificultad dependiendo del input
    def dificultad_calculo(dificultad):
        if dificultad == 'f':
            salas=5
        elif dificultad == 'm':
            salas=7
        elif dificultad == 'd':
            salas=9
        return salas
    
    #Funcion del juego que llama a todas las demás
    def game():
        corriendo=True
        while corriendo==True:
            vida=3
            print("""Bienvenido a Mathventure
            En este juego deberás completar salas las cuales tendrán un enemigo el cual es una pregunta de  matemáticas, si respondes correctamente pasarás
            a la siguiente sala. 

            Para poder ganar este juego recuerda lo siguiente:
            \t*Dependiendo el nivel de dificultad te enfrentaras con varias salas de problemas hasta completar todas las salas.
            \t*Procura enfocarte y recuerda que solo tienes 3 vidas.
            \t*Algunas preguntas dan numeros con decimales, redondea hacia abajo y deja numeros enteros.
            \t*Lo más importante, diviertete
            
            Ten cuidado, recuerda que si fallas en responder una pregunta perderás una vida. Si pierdes las 3 tendrás que iniciar desde el inicio.
            Dependiendo el nivel de dificultad será el número de salas que tendrás que completar antes de acabar la aventura. Si no entiendes por qué por qué te
            te equivocaste no te preocupes, puedes repasar las preguntas y sus respuestas al finalizar la aventura.""")
            input("Presiona enter para continuar...")
            clear_screen()
            puntaje=0
            dificultad=input('Ingresa el nivel de dificultad que deseas enfrentar, "f" facil, "m" media, "d" dificil. ')
            salas=dificultad_calculo(dificultad)
            hoja=choja_respuestas(dificultad)
            hoja2=choja_preguntas(dificultad)
            for i in range(salas):
                if vida!=0:
                    resp=preguntar_respuesta(hoja,hoja2)
                    if resp==True:
                        puntaje+=1
                        print("Correcto! Avanzas al siguiente nivel")
                    else:
                        print(f'Incorrecto, te quedan {vida} vidas.')
                        vida-=1
                else:
                    print('Perdiste todas tus vidas :(')
                    break
                print(f'Llevas {puntaje} puntos.')
            if vida>0:
                print(f'''Terminaste la aventura!
            \t*Obtuviste {puntaje} puntos
            \t*Si deseas ver las preguntas y sus respuestas para estudiar presiona 1 o 0 para salir''')
            else:
                print(f'''Fallaste y no terminaste la aventura!
                \t*Obtuviste {puntaje} puntos pero perdiste.
                \t*Si deseas ver las preguntas y sus respuestas para estudiar presiona 1 o 0 para salir''')
            decision=input('...')
            salir2=True
            while salir2==True:
                if decision=='1':
                    print(hoja2)
                    print(hoja)
                    decision=input('...')
                elif decision=='0':
                    Salir2=False
                    corriendo=False
                    break
    game()
    
    
# --------------------------------------- MEMORAMA -----------------------------
def memorama():
    print("-----------------------------------------------------------")
    print("¡Bienvenid@ al juego de memorama!")
    print("Por Aldo Degollado")
    print("-----------------------------------------------------------")
    input("Presione ENTER para comenzar")
    print(" \n"*100)
    print("-----------------------------------------------------------")
    print("REGLAS")
    print("-----------------------------------------------------------")
    print("En ese juego usted tendrá que encontrar los pares en el tablero, el cual se revuelve con cada juego para hacerlo \nmás desafiante. El juego tiene un total de 3 niveles de dificultad: fácil, normal y difícil, donde en fácil tendra \nque encontrar 10 pares, en normal 30 y en difícil 50.")
    print("Para voltear una carta usted deberá ingresar primero el número del renglón en donde se encuentra y posteriormente el número de columna. (Tanto los renglones como las columnas comienzan con 1).")
    print("")

    dificultad = int(input("Escoja su nivel de dificultad (donde 1 es fácil, 2 es normal y 3 es difícil): "))
    global length_lista
    length_lista= 0
    global renglones
    renglones = 0
    global juego
    juego = 0

    def clear_screen():   #Esta función limpia el shell
        print(" \n"*100)
        
    def crear_baraja():   #Esta función crea el mazo a barajear dependiendo el nivel de dificultad
        baraja = []
        letras = []
        global length_lista
        global renglones
        if dificultad == 1:
            for letra in ["A","B","C","D","E","F","G","H","I","J"]:
                baraja.append(letra)
                baraja.append(letra)
            length_lista = len(baraja)
            renglones = 4
            return baraja
        elif dificultad == 2:
            for letra in ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O"]:
                baraja.append(letra)
                baraja.append(letra)
            length_lista = len(baraja)
            renglones = 6
            return baraja
        elif dificultad == 3:
            for letra in ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","Z"]:
                baraja.append(letra)
                baraja.append(letra)
            length_lista = len(baraja)
            renglones = 10
            return baraja

    def crear_lista_revuelta(baraja,length_lista):  #Función que revuelve las cartas
        baraja_prueba = baraja
        baraja1 = []
        lista_revuelta = []
        for i in range(0,length_lista):
            length_lista = length_lista - 1
            random_numero = random.randint(0,length_lista)
            carta = baraja_prueba.pop(random_numero)
            baraja1.append(carta)
            if len(baraja1) % 5 == 0:
                lista_revuelta.append(baraja1)
                baraja1 = []
        return lista_revuelta

    def crear_tablero(length_lista):       #Función que crea el display que se le mostrará al usuario
        baraja2 = []
        tablero = []
        for i in range(0,length_lista):
            carta = "X"
            baraja2.append(carta)
            if len(baraja2) % 5 == 0:
                tablero.append(baraja2)
                baraja2 = []
        return tablero
       
    def imprimir_tablero(tablero):
        n = 0
        clear_screen()
        for i in range(0,renglones):
            print (tablero[n])
            n = n + 1
            
    def voltear_carta(tablero):        
        tablero_mod = tablero.copy()
        carta1 = 0
        carta2 = 0
        for i in range (1,3):
            if i ==1:
                print("")
                renglon = int(input("Ingrese el valor del renglón donde se encuentra la carta que desea voltear: "))
                columna = int(input("Ingrese el valor de la columna donde se encuentra la carta que desea voltear: "))
                index_r1 = renglon - 1
                index_c1 = columna - 1
                while tablero[index_r1][index_c1] != "X":
                    imprimir_tablero(tablero)
                    print("")
                    print("Ya haz volteado esta carta, intenta con otra")
                    print("")
                    renglon = int(input("Ingrese el valor del renglón donde se encuentra la carta que desea voltear: "))
                    columna = int(input("Ingrese el valor de la columna donde se encuentra la carta que desea voltear: "))
                    index_r1 = renglon - 1
                    index_c1 = columna - 1
                carta1 = lista_revuelta[index_r1][index_c1]
                tablero[index_r1][index_c1] = carta1
                imprimir_tablero(tablero)
            elif i == 2:
                renglon = int(input("Ingrese el valor del renglón donde se encuentra la carta que desea voltear: "))
                columna = int(input("Ingrese el valor de la columna donde se encuentra la carta que desea voltear: "))
                index_r2 = renglon - 1
                index_c2 = columna - 1
                while tablero[index_r2][index_c2] == carta1 or tablero[index_r2][index_c2] != "X":
                    imprimir_tablero(tablero)
                    print("")
                    print("Ya haz volteado esta carta, intenta con otra")
                    print("")
                    renglon = int(input("Ingrese el valor del renglón donde se encuentra la carta que desea voltear: "))
                    columna = int(input("Ingrese el valor de la columna donde se encuentra la carta que desea voltear: "))
                    index_r2 = renglon - 1
                    index_c2 = columna - 1
                carta2 = lista_revuelta[index_r2][index_c2]
                tablero[index_r2][index_c2] = carta2
                imprimir_tablero(tablero)
                condicion = comprobar_par(carta1,carta2)
                if condicion == 0:
                    print("")
                    input("No son par(Presiona ENTER para continuar) ")
                    tablero[index_r1][index_c1] = "X"
                    tablero[index_r2][index_c2] = "X"
                elif condicion == 1:
                    print("")
                    input("¡Encontraste un par!(Presiona ENTER para continuar) ")
        return tablero

    def comprobar_par(carta1,carta2):
        if carta1 == carta2:
            condicion = 1
        else:
            condicion = 0
        return condicion

    def condicion_victoria(tablero):
        for i in range (0,renglones):
            if "X" in tablero[i]:
                juego = 0
            else:
                juego = 1
        return juego

    baraja = crear_baraja()
    barajaP = baraja[:]
    lista_revuelta = crear_lista_revuelta(baraja,len(baraja))
    tablero = crear_tablero(len(barajaP))
    while juego == 0:
        imprimir_tablero(tablero)
        tablero = voltear_carta(tablero)
        juego = condicion_victoria(tablero)
    if juego == 1:
        clear_screen()
        print("-----------------------------------------------------------")
        print("¡FELICIDADES!")
        print("-----------------------------------------------------------")
        print("")
        input("Haz ganado, gracias por jugar.")


# ---------------------------------------- MENU GENERAL ------------------------   
   

def menu(): 
    print("""

        Autores:
            Mind-Meister: Pablo Blanco           Mathventure: Sebastián Rojas         Memorama: Aldo Degollado

                                    - BIENVENIDO A LOS JUEGOS QUE TE AYUDARÁN A APRENDER -
                    Con estos tres juegos te aseguramos que mejorarás muchísimo en el nivel de diferentes áreas educativas.
                    
        Los juegos disponibles son:
            Mind-Meister:   Un juego de pura lógica y muy divertido.
            Mathventure:    Un juego para pasar diferentes salas resolviendo problemas matemáticos que promete \n            entretención.
            Memorama:    Un juego clásico de memorama con diferentes nivles de dificultad que te ayudará a mejorar tu \n            agilidad mental y tu memoria.
            
            Para elejir el juego que desees jugar haz click en la tecla señalada:
            
            Mind Meister    - 1
            Mathventure     - 2
            Memorama         - 3
            
            Salir           - 4
            
            ¡A jugar!

    """)
    
menuValidos = ['1','2','3','4']

#---------------------------------------------------------------------------
#PRINCIPAL
while True:
    cls()
    menu()
    menuResp = input('Elije tu opción:  ')
    while menuResp not in menuValidos:
        menuResp = input('Elije una opción válida:  ')
    
    if menuResp == '1':
        mindMeister()
    elif menuResp == '2':
        mathventure()
    elif menuResp == '3':
        memorama()
    elif menuResp == '4':
        print('¡Gracias por haber jugado!')
        sys.exit()
