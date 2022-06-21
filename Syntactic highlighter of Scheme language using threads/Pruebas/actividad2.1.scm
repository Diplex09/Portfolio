;   Abraham Mendoza A01
;   Aldo Degollado A01
;   Luis Alonso Martínez García A01636255

; 1. La funcion 'fahrenheit-to-celsius' toma como entrada una temperatura f en grados Fahrenheit 
; y la convierte a su equivalente en grados

(define (fahrenheit-to-celsius f)
   (exact->inexact (/ (* 5 (- f 32)) 9))
)

; 2. La funcion 'sign' recibe como entrada un valor entero n. Devuelve -1 si n es negativo, 1 si n es positivo mayor
; que cero, o 0 si n es cero.

(define (sign n) 
    (cond
        ((= n 0) 0)
        ((> n 0) 1)
        ((< n 0) -1)   
    )
)

;3. La funcion roots devuelve la raız que resuelve una ecuacion cuadratica a partir de 
;sus tres coeficiente, a, b y c, que se reciben como entrada.
 (define (roots a b c)

   (define discriminant
    (lambda (a b c)
      (sqrt (- (square b) (* 4 a c)))))

   (define square
     (lambda (n)
       (* n n)))

   (/ (+ (- b) (discriminant a b c)) (* 2 a))
  )

  ;4. El  ́ındice de masa corporal, o BMI por sus siglas in ingl ́es, se utiliza para determinar si la proporcion
  ; de peso y altura de una persona es adecuada. 

    (define (bmi w h)
        (define  square
            (lambda (n)
                (* n n)))
                (cond
                    ((< (/ w (square h)) 20) 'underweight)
                    ((and(>= (/ w (square h)) 20) (< (/ w (square h)) 25)) 'normal)
                    ((and(>= (/ w (square h)) 25) (< (/ w (square h)) 30)) 'obese1)
                    ((and(>= (/ w (square h)) 30) (< (/ w (square h)) 40)) 'obese2)
                    ((>= (/ w (square h)) 40) 'obese3))
                    )

;6. La función duplica te toma una lista lst como entrada y devuelve una nueva lista en donde cada elemento de lst está duplicado.

  (define (duplicate lst)
    (if (null? lst)
        '()
        (cons (car lst)
              (cons (car lst)
                    (duplicate (cdr lst))))))

;10. La función positives toma una lista de números lst como entrada y devuelve una nueva lista que solocontiene los n ́umeros 
;positivos de lst.

  (define (positives lst)
    (cond ((null? lst) '())
          ((negative? (car lst)) (positives (cdr lst)))
          (else (cons (car lst) (positives (cdr lst))))))