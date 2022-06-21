/*                                                  */
/*  Actividad 3.2 - Programando un DFA              */
/*                                                  */
/*  Luis Alonso Martínez García - A01636255         */
/*  Abraham Mendoza Pérez - A01274857               */
/*  Aldo Alejandro Degollado Padilla - A01638391    */
/*                                                  */

#include <iostream>
#include <sstream>
#include <fstream>
#include <windows.h>
#include <string>
#include <iomanip>

// Prints the set of chars as an error depending on the state of the automaton from which it originated
void printError(std::string toPrint, int qPosition)
{
    switch(qPosition)
    {
        case 0:
        {
            std::cout << toPrint << std::setw(30) << "Error: Invalid initial char" << std::endl;
            break;
        }
        case 1:
        {
            std::cout << toPrint << std::setw(30) << "Error: Invalid variable" << std::endl;
            break;
        }
        case 2:
        {
            std::cout << toPrint << std::setw(30) << "Error: Invalid integer number" << std::endl;
            break;
        }
        case 3:
        {
            std::cout << toPrint << std::setw(30) << "Error: Invalid decimal number" << std::endl;
            break;
        }
        default:
        {
            std::cout << toPrint << std::setw(30) << "Error: Invalid exponential number" << std::endl;
            break;
        }
    }
}

// Prints the set of chars as an error caused by an invalid char in the language 
void printInvalidChar(std::string toPrint)
{
    std::cout << toPrint << std::setw(30) << "Error: Invalid character" << std::endl;
}

// Prints the set of chars as a variable
void printVariable(std::string toPrint)
{
    std::cout << toPrint << std::setw(30) << "Variable" << std::endl;
}

// Prints the set of chars as an integer number 
void printInteger(std::string toPrint)
{
    std::cout << toPrint << std::setw(30) << "Entero" << std::endl;
}

// Prints the set of chars as a real decimal number
void printReal(std::string toPrint)
{
    std::cout << toPrint << std::setw(30) << "Real" << std::endl;
}

// Prints the set of chars depending the operator
void printOperator(char toPrint)
{
    switch(toPrint)
    {
        case '+':
        {
            std::cout << toPrint << std::setw(30) << "Suma" << std::endl;
            break;
        }
        case '-':
        {
            std::cout << toPrint << std::setw(30) << "Resta" << std::endl;
            break;
        }
        case '*':
        {
            std::cout << toPrint << std::setw(30) << "Multiplicacion" << std::endl;
            break;
        }
        case '^':
        {
            std::cout << toPrint << std::setw(30) << "Potencia" << std::endl;
            break;
        }
        case '(':
        {
            std::cout << toPrint << std::setw(30) << "Parentesis de apertura" << std::endl;
            break;
        }
        case ')':
        {
            std::cout << toPrint << std::setw(30) << "Parentesis de cierre" << std::endl;
            break;
        }
        case '=':
        {
            std::cout << toPrint << std::setw(30) << "Asignacion" << std::endl;
            break;
        }
        case '/':
        {
            std::cout << toPrint << std::setw(30) << "Division" << std::endl;
            break;
        }
    }
}

// Prints the set of chars as a comment
void printComment(std::string toPrint)
{
    std::cout << toPrint << std::setw(30) << "Comentario" << std::endl;
}

void lexerArithmetic(std::string fileName)
{
    std::string line;
    std::ifstream expressionsFile;
    std::string sigma = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+-*/^_().\n\t ";    // All the elements that the language reads
    std::string q0 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789=+-*/^()";              // All the possibly initial elements for this language
    std::string q1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789_";                     // All the elements accepted in q1
    std::string q2 = "0123456789.";                                                                         // All the elements accepted in q2
    std::string q3 = "0123456789eE";                                                                        // All the elements accepted in q3
    std::string q4 = "0123456789-";                                                                         // All the elements accepted in q4
    std::string numbers = "0123456789";                                                                     // All the elements accepted in q5 and q6
    std::string operators = "+-*^()=";                                                                      // All the elements accepted in q7, q8, q9, q10, q11, q12 and q13
    std::string comment = "/";                                                                              // All the elements accepted in q14
    std::string delimiters = "+-*^()=/\n\t ";                                                               // All the elements that delimit a set of chars
    std::string ignoreUnlessComment = "\n\t ";                                                              // All the elements that wont appear in a set of chars, unless it's inside a comment
    std::string toPrint;                                                                                    // Stores the set of chars to print
    char current;                                                                                           // Stores the current char for reading
    int lineLength = 0;                                                                                     // Stores the total of chars in a line
    int qPosition = 0;                                                                                      // Stores the state of the automata
    bool readNextChar;                                                                                      // Determines if we read the next char
    bool hasInvalidChar = false;                                                                            // Determines if a set of chars has a invalid one in the language
    bool hasError = false;                                                                                  // Determines if the set of chars has a mistake 
    bool isFirstChar = true;                                                                                // Determines if the current char is the first char of a set


    // Open the file to analyze given by user
    expressionsFile.open(fileName, std::ios::in);

    // Asks the name of the file to analyze until the user inputs it correctly
    while(expressionsFile.fail())
    {
        std::cout << "Unable to open \"" << fileName << "\", input the name of the file to analyze (include extension): ";
        std::cin >> fileName;
        expressionsFile.open(fileName, std::ios::in);
    }
    
    // Info of devs
    system("cls");
    std::cout << "\n |-|-|      DFA ANALYSIS      |-|-|" << std::endl;
    std::cout << "By: Aldo Degollado, Abraham Mendoza, and Alonso Martinez\n" << std::endl;

    // Read each line of the file
    while(expressionsFile.is_open() && !expressionsFile.eof())
    {
        std::getline(expressionsFile, line);
        line = line + '\n';
        lineLength = line.length();
        isFirstChar = true;
        qPosition = 0;

        // Read each character of the line
        for(int i=0; i < lineLength; i++)
        {
            readNextChar = false;
            current = line[i];
            while(!readNextChar)
            {
                // Verify if the current character is a valid one in this language
                if(sigma.find(current) == std::string::npos)
                {
                    hasInvalidChar = true;
                    hasError = true;
                    readNextChar = true;
                }
                // Only the errors followed by a delimiter that are not inside a comment fail this if (this means that the error needs to be printed) 
                if(!((hasInvalidChar || hasError) && (delimiters.find(current) != std::string::npos || i == lineLength - 1) && qPosition != 15))
                {
                    // Switch the state of the automaton
                    switch(qPosition)
                    {
                        case 0:
                        {
                            // Ignores tabs, spaces, and line breaks unless they are inside of a comment
                            if(ignoreUnlessComment.find(current) != std::string::npos)
                            {
                                readNextChar = true;
                            }
                            // Verifies if the char is valid as an initial char, if false, it generates an error
                            else if(q0.find(current) == std::string::npos)
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            // Verifies if the char is a diagonal, if true, goes to state q14 of the automaton
                            else if(comment.find(current) != std::string::npos)
                            {
                                qPosition = 14;
                                isFirstChar = true;
                            }
                            // Verifies if the char is a number, if true, goes to state q2 of the automaton
                            else if(numbers.find(current) != std::string::npos)
                            {
                                qPosition = 2;
                                isFirstChar = true;
                            }
                            // Verifies if the char is a operator, if true, goes to a switch that covers the states from q7 to q13 of the automaton
                            else if(operators.find(current) != std::string::npos)
                            {
                                qPosition = 0;
                                readNextChar = true;
                                printOperator(current);
                                toPrint.clear();
                            }
                            // The only way to get here is if the char is a variable, goes to state q1 of the automaton
                            else
                            {
                                qPosition = 1;
                                isFirstChar = true;
                            }
                            break;
                        }
                        // The char/set of chars constitutes a variable
                        case 1:
                        {
                            // Verifies if the current char is accepted in the state q1 of the automaton
                            if(q1.find(current) != std::string::npos)
                            {
                                toPrint = toPrint + current;
                                readNextChar = true;
                            }
                            // Prints the varible if the current char is a delimiter and the set has no mistakes
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                if(!hasError)
                                {
                                    printVariable(toPrint);
                                    toPrint.clear();
                                    qPosition = 0;
                                }
                                readNextChar = false;
                            }
                            // The current char is a unaccepted char and therfore the set has now a mistake
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            break;
                        }
                        // The char/set of chars constitutes an integer number
                        case 2:
                        {
                            // Verifies if the current char is accepted in the state q2 of the automaton
                            if(q2.find(current) != std::string::npos)
                            {
                                // Verifies if the current char is a period, if true, it copies to the set of chars and moves to the state q3 of the automaton
                                if(current == '.' && !hasError)
                                {
                                    toPrint = toPrint + current;
                                    qPosition = 3;
                                    readNextChar = true;
                                    isFirstChar = true;
                                }
                                // The char is a number
                                else
                                {
                                    toPrint = toPrint + current;
                                    readNextChar = true;
                                }
                            }
                            // Verifies if the current char is a delimiter
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                // Verifies if there's an error in the current set of chars
                                if(!hasError)
                                {
                                    // If qPosition = 3 it means that the set of chars is a decimal number without decimal part, so it prints the set of chars as a real number
                                    if(qPosition == 3)
                                    {
                                        printReal(toPrint);
                                    }
                                    // The set of chars is a integer number and it prints it as what it is
                                    else
                                    {
                                        printInteger(toPrint);
                                    }
                                    toPrint.clear();
                                    qPosition = 0;
                                }
                            }
                            // The current char is a unaccepted char and therfore the set has now a mistake
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                            }
                            break;
                        }
                        // The set of chars constitutes a decimal real number
                        case 3:
                        {
                            // Verifies if the current char is accepted in the state q3 of the automaton
                            if(q3.find(current) != std::string::npos)
                            {
                                // Verifies if the current char is an exponential sign and if our set of chars has errors
                                if((current == 'e' || current == 'E') && !hasError)
                                {
                                    // Verifies if it is the first char read at q3, if true, it's an invalid exponential number
                                    if(isFirstChar)
                                    {
                                        toPrint = toPrint + current;
                                        hasError = true;
                                        readNextChar = true;
                                    }
                                    // The set has a decimal part and therefore it's a partial valid exponential number
                                    else
                                    {
                                        toPrint = toPrint + current;
                                        qPosition = 4;
                                        readNextChar = true;
                                    }
                                }
                                // The current char is a number
                                else
                                {
                                    toPrint = toPrint + current;
                                    readNextChar = true;
                                }
                            }
                            // Verifies if the current char is a delimiter
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                // Verifies if there's an error in the current set of chars
                                if(!hasError)
                                {
                                    // If qPosition = 4 it means that the set of chars is a exponential number without exponent, therefore it's an invalid exponential number
                                    if(qPosition == 4)
                                    {
                                        hasError = true;
                                    }
                                    // The current set of chars is a valid decimal number
                                    else
                                    {
                                        printReal(toPrint);
                                        toPrint.clear();
                                        qPosition = 0;
                                    }
                                }
                                readNextChar = false;
                            }
                            // The current char is a unaccepted char and therfore the set has now a mistake
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            isFirstChar = false;
                            break;
                        }
                        // The set of chars constitutes an exponential real number
                        case 4:
                        {
                            // Verifies if the current char is accepted in the state q4 of the automaton and if our set of chars has errors
                            if(q4.find(current) != std::string::npos && !hasError)
                            {
                                // Verifies if the current char is a minus operator, if true, the set of chars becomes an exponential number with negative exponent and moves to the state q5 of the automaton
                                if(current == '-')
                                {
                                    toPrint = toPrint + current;
                                    qPosition = 5;
                                    readNextChar = true;
                                }
                                // The char is a number and, therefore, the set of chars becomes an exponential number with positive exponent and moves to the state q6 of the automaton
                                else
                                {
                                    toPrint = toPrint + current;
                                    qPosition = 6;
                                    readNextChar = true;
                                }
                            }
                            // Verifies if the current char is a delimiter, if true, the set of chars becomes an invalid exponential number (has no exponent)
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                hasError = true;
                                readNextChar = false;
                            }
                            // The current char is a unaccepted char and therfore the set has now a mistake
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            break;
                        }
                        // The set of chars are a exponential real number with negative exponent
                        case 5:
                        {
                            // Verifies if the current char is accepted in the state q5 (it only accepts numbers), if true, it moves to state q6 of the automaton
                            if(numbers.find(current) != std::string::npos)
                            {
                                toPrint = toPrint + current;
                                qPosition = 6;
                                readNextChar = true;
                            }
                            // Verifies if the current char is a delimiter, if true, the set of chars becomes an invalid exponential number (has no exponent)
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                hasError = true;
                                readNextChar = false;
                            }
                            // The current char is a unaccepted char and therfore the set has now a mistake
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            break;
                        }
                        // The set of chars constitutes an exponential real number
                        case 6:
                        {
                            // Verifies if the current char is accepted in the state q6 (it only accepts numbers)
                            if(numbers.find(current) != std::string::npos)
                            {
                                toPrint = toPrint + current;
                                readNextChar = true;
                            }
                            // Verifies if the current char is a delimiter
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                // Verifies if there's an error in the current set of chars, if false, the set of chars prints as a exponential real number
                                if(!hasError)
                                {
                                    printReal(toPrint);
                                    toPrint.clear();
                                    qPosition = 0;
                                }
                            }
                            // The current char is a unaccepted char and therfore the set has now a mistake
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            break;
                        }
                        // The char is a division operator (possibly a comment)
                        case 14:
                        {
                            // Verifies if the current char is accepted in the state q14 (it only accepts division operators)
                            if(comment.find(current) != std::string::npos)
                            {
                                toPrint = toPrint + current;
                                // Verifies if it is the first char read at q14 
                                if(isFirstChar)
                                {
                                    readNextChar = true;
                                }
                                // The set of chars becomes a comment and moves to state q16 of the automaton
                                else
                                {
                                    qPosition = 15;
                                    readNextChar = true;
                                }
                            }
                            // There's no chance for the set of chars to become a comment, so it prints it as division operator
                            else
                            {
                                printOperator(toPrint[0]);
                                toPrint.clear();
                                qPosition = 0;
                            }
                            isFirstChar = false;
                            break;
                        }
                        // The set of chars and the rest of the line constitute a comment
                        case 15:
                        {
                            // Verifies if the current char is a line break, if true, it prints the comment with it current chars
                            if(current == '\n')
                            {
                                printComment(toPrint);
                                toPrint.clear();
                                qPosition = 0;
                            }
                            // The current char isn't a line break, therefore, it's part of the comment
                            else
                            {
                                toPrint = toPrint + current;
                            }
                            readNextChar = true;
                            break;
                        }
                    }
                }
                // Only the erros that need to be printed arrive here
                else 
                {
                    // Verifies if the current char is a delimiter, if false, it adds the char to the current seto of chars
                    if(delimiters.find(current) == std::string::npos)
                    {
                        toPrint = toPrint + current;
                        readNextChar = true;
                    }
                    // Verifies if the cause of the error was an invalid char in the language, if true, prints the set of chars as a invalid char error
                    if(hasInvalidChar)
                    {
                        printInvalidChar(toPrint);
                        toPrint.clear();
                        qPosition = 0;
                        hasInvalidChar = false;
                        hasError = false;
                    }
                    // The cause of the error was a invalid char in a certain state of the automaton, therefore, it prints the set of chars as a certain error depending on the state of the automaton 
                    else
                    {
                        printError(toPrint,qPosition);
                        toPrint.clear();
                        qPosition = 0;
                        hasError = false;
                    }
                }
            }
        }
    }
    // Closes the file that the user provided
    expressionsFile.close();
}

int main(void)
{
    std::string fileName;
    std::cout << "\n |-|-|      DFA ANALYSIS      |-|-|" << std::endl;
    std::cout << "By: Aldo Degollado, Abraham Mendoza, and Alonso Martinez\n" << std::endl;
    std::cout << "\nInput the name of the file to analyze (with extension): ";
    std::cin >> fileName;

    lexerArithmetic(fileName);

    return 0;
}