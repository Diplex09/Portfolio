/*                                                  */
/*  Actividad 3.4 - Resaltador de sintaxis          */
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
#include <chrono>

// Prints the header and basic HTML tags in the output file
void printHtmlInfoAndOpeningTags(std::ostream& stream)
{
    stream << "<!DOCTYPE html>" << std::endl;
    stream << "<html lang=\"en\">" << std::endl;
    stream << "<head>" << std::endl;
    stream << "\t<meta charset=\"UTF-8\">" << std::endl;
    stream << "\t<link rel=\"stylesheet\" href=\"styles.css\">" << std::endl;
    stream << "\t<title>DFA SYNTATIC HIGHLIGHTER</title>" << std::endl;
    stream << "</head>" << std::endl << std::endl;
    stream << "<body>" << std::endl;
    stream << "\t<main class=\"no-space\">" << std::endl;
}

// Print the closing tags for the html file to work
void printHtmlClosingTags(std::ostream& stream)
{
    stream << "\t</main>" << std::endl;
    stream << "</body>" << std::endl;
    stream << "</html>" << std::endl;
}

// Prints the set of chars as an error depending on the state of the automaton from which it originated
void printError(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"errors\">" << toPrint << "</span>" << std::endl;
}

// Prints the set of chars as a variable
void printVariable(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"identifiers\">" << toPrint << "</span>" << std::endl;
}

// Prints the set of chars as a number 
void printNumber(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"numbers\">" << toPrint << "</span>" << std::endl;
}

// Prints the set of chars depending the operator
void printOperator(char toPrint, std::ostream& stream)
{
    switch(toPrint)
    {
        case '=':
        {
            stream << "\t\t<span class=\"operators\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case '+':
        {
            stream << "\t\t<span class=\"operators\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case '-':
        {
            stream << "\t\t<span class=\"operators\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case '*':
        {
            stream << "\t\t<span class=\"operators\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case '/':
        {
            stream << "\t\t<span class=\"operators\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case '^':
        {
            stream << "\t\t<span class=\"operators\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case '(':
        {
            stream << "\t\t<span class=\"special-chars\">" << toPrint << "</span>" << std::endl;
            break;
        }
        case ')':
        {
            stream << "\t\t<span class=\"special-chars\">" << toPrint << "</span>" << std::endl;
            break;
        }
    }
}

// Prints the set of chars as a logical expression
void printLogical(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"logicals\">" << toPrint << "</span>" << std::endl;
}

// Prints the set of chars as a symbol
void printSymbol(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"symbols\">" << toPrint << "</span>" << std::endl;
}

// Prints the set of chars as a reserved word
void printReservedWord(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"reserved-words\">" << toPrint << "</span>" << std::endl;
}

// Prints the set of chars as a comment
void printComment(std::string toPrint, std::ostream& stream)
{
    stream << "\t\t<span class=\"comments\">" << toPrint << "</span>" << std::endl;
}

void lexerArithmetic(std::string fileName)
{
    std::ifstream expressionsFile;                                                                              // Input file given by user
    std::ofstream outputFile;                                                                                   // Output file with the 
    std::string line;                                                                                           // Current line that the DFA is reading
    std::string epsilon = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+-*/^_().#';\n\t ";   // All the elements that the language reads
    std::string q0 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789=+-*/^()#';";               // All the possibly initial elements for this language
    std::string q1 = "0123456789.";                                                                             // All the elements accepted in q1
    std::string q2 = "0123456789eE";                                                                            // All the elements accepted in q2
    std::string q3 = "0123456789-";                                                                             // All the elements accepted in q3
    std::string numbers = "0123456789";                                                                         // All the elements accepted in q4 and q5
    std::string q7 = "tf";                                                                                      // All the elements accepted in q7
    std::string operators = "=+-*/^()";                                                                         // All the elements accepted in q11, q12, q13, q14, q15, q16, q17, and q18
    std::string comment = ";";                                                                                  // All the elements accepted in q19
    std::string q21 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789_";                        // All the elements accepted in q21
    std::string delimiters = "+-*^()=/;\n\t ";                                                                  // All the elements that delimit a set of chars
    std::string ignoreUnlessComment = "\n\t ";                                                                  // All the elements that wont appear in a set of chars, unless it's inside a comment
    std::string toPrint;                                                                                        // Stores the set of chars to print
    char current;                                                                                               // Stores the current char for reading
    int lineLength = 0;                                                                                         // Stores the total of chars in a line
    int qPosition = 0;                                                                                          // Stores the state of the automata
    bool readNextChar;                                                                                          // Determines if we read the next char
    bool hasError = false;                                                                                      // Determines if the set of chars has a mistake 
    bool isFirstChar = true;                                                                                    // Determines if the current char is the first char of a set
    bool symbolHasAtLeastOneChar = false;                                                                       // Determines if the current set of chars is a valid symbol

    // Open the file to analyze given by user
    expressionsFile.open(fileName, std::ios::in);

    // Open/Creates the output file
    outputFile.open("output.html", std::ios::out);
    printHtmlInfoAndOpeningTags(outputFile);
    
    // Asks the name of the file to analyze until the user inputs it correctly
    while(expressionsFile.fail())
    {
        std::cout << "Unable to open \"" << fileName << "\", input the name of the file to analyze (include extension): ";
        std::cin >> fileName;
        expressionsFile.open(fileName, std::ios::in);
    }

    // Read each line of the file
    while(expressionsFile.is_open() && !expressionsFile.eof())
    {
        std::getline(expressionsFile, line);
        line = line + '\n';
        lineLength = line.length();
        isFirstChar = true;
        hasError = false;
        qPosition = 0;

        // Read each character of the line
        for(int i=0; i < lineLength; i++)
        {
            readNextChar = false;
            current = line[i];
            while(!readNextChar)
            {
                // Verify if the current character is a valid one in this language
                if(epsilon.find(current) == std::string::npos)
                {
                    hasError = true;
                    readNextChar = true;
                }
                // Only the errors followed by a delimiter that are not inside a comment fail this if (this means that the error needs to be printed) 
                if(!(hasError && (delimiters.find(current) != std::string::npos || i == lineLength - 1) && qPosition != 19))
                {
                    // Switch the state of the automaton
                    switch(qPosition)
                    {
                        case 0:
                        {
                            // Ignores tabs, spaces, and line breaks unless they are inside of a comment
                            if(ignoreUnlessComment.find(current) != std::string::npos)
                            {
                                if(current == ' ')
                                {
                                    outputFile << "\t\t<span>&nbsp</span>" << std::endl;
                                }
                                else if(current == '\t')
                                {
                                    outputFile << "\t\t<span>&nbsp&nbsp&nbsp</span>" << std::endl;
                                }
                                readNextChar = true;
                            }
                            // Verifies if the char is valid as an initial char, if false, it generates an error
                            else if(q0.find(current) == std::string::npos)
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            // Verifies if the char is a hashtag, if true, goes to state q6 of the automaton
                            else if(current == '#')
                            {
                                qPosition = 6;
                                isFirstChar = true;
                            }
                            // Verifies if the char is a hashtag, if true, goes to state q8 of the automaton
                            else if(current == '\'')
                            {
                                qPosition = 8;
                                isFirstChar = true;
                            }
                            // Verifies if the char is a diagonal, if true, goes to state q14 of the automaton
                            else if(comment.find(current) != std::string::npos)
                            {
                                qPosition = 19;
                                isFirstChar = true;
                            }
                            // Verifies if the char is a number, if true, goes to state q2 of the automaton
                            else if(numbers.find(current) != std::string::npos)
                            {
                                qPosition = 1;
                                isFirstChar = true;
                            }
                            // Verifies if the char is a operator, if true, goes to a switch that covers the states from q7 to q13 of the automaton
                            else if(operators.find(current) != std::string::npos)
                            {
                                qPosition = 0;
                                readNextChar = true;
                                printOperator(current, outputFile);
                                toPrint.clear();
                            }
                            // The only way to get here is if the char is a variable, goes to state q1 of the automaton
                            else
                            {
                                qPosition = 21;
                                isFirstChar = true;
                            }
                            break;
                        }
                        // The char/set of chars constitutes an integer number
                        case 1:
                        {
                            // Verifies if the current char is accepted in the state q1 of the automaton
                            if(q1.find(current) != std::string::npos)
                            {
                                // Verifies if the current char is a period, if true, it copies to the set of chars and moves to the state q2 of the automaton
                                if(current == '.' && !hasError)
                                {
                                    toPrint = toPrint + current;
                                    qPosition = 2;
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
                                    // If qPosition = 2 it means that the set of chars is a decimal number without decimal part, so it prints the set of chars as a real number
                                    if(qPosition == 2)
                                    {
                                        printNumber(toPrint, outputFile);
                                    }
                                    // The set of chars is a integer number and it prints it as what it is
                                    else
                                    {
                                        printNumber(toPrint, outputFile);
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
                                readNextChar = true;
                            }
                            break;
                        }
                        // The set of chars constitutes a decimal real number
                        case 2:
                        {
                            // Verifies if the current char is accepted in the state q2 of the automaton
                            if(q2.find(current) != std::string::npos)
                            {
                                // Verifies if the current char is an exponential sign and if our set of chars has errors
                                if((current == 'e' || current == 'E') && !hasError)
                                {
                                    // Verifies if it is the first char read at q2, if true, it's an invalid exponential number
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
                                        qPosition = 3;
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
                                    // If qPosition = 3 it means that the set of chars is a exponential number without exponent, therefore it's an invalid exponential number
                                    if(qPosition == 3)
                                    {
                                        hasError = true;
                                    }
                                    // The current set of chars is a valid decimal number
                                    else
                                    {
                                        printNumber(toPrint, outputFile);
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
                        case 3:
                        {
                            // Verifies if the current char is accepted in the state q3 of the automaton and if our set of chars has errors
                            if(q3.find(current) != std::string::npos && !hasError)
                            {
                                // Verifies if the current char is a minus operator, if true, the set of chars becomes an exponential number with negative exponent and moves to the state q4 of the automaton
                                if(current == '-')
                                {
                                    toPrint = toPrint + current;
                                    qPosition = 4;
                                    readNextChar = true;
                                }
                                // The char is a number and, therefore, the set of chars becomes an exponential number with positive exponent and moves to the state q5 of the automaton
                                else
                                {
                                    toPrint = toPrint + current;
                                    qPosition = 5;
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
                        case 4:
                        {
                            // Verifies if the current char is accepted in the state q4 (it only accepts numbers), if true, it moves to state q6 of the automaton
                            if(numbers.find(current) != std::string::npos)
                            {
                                toPrint = toPrint + current;
                                qPosition = 5;
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
                        case 5:
                        {
                            // Verifies if the current char is accepted in the state q5 (it only accepts numbers)
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
                                    printNumber(toPrint, outputFile);
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
                        case 6:
                        {
                            toPrint = toPrint + current;
                            qPosition = 7;
                            readNextChar = true;
                            break;
                        }
                        case 7:
                        {
                            if(q7.find(current) != std::string::npos && !hasError)
                            {
                                if(!isFirstChar)
                                {
                                    toPrint = toPrint + current;
                                    hasError = true;
                                    readNextChar = true;
                                }
                                else if(current == 't' || current == 'T')
                                {
                                    toPrint = toPrint + current;
                                    readNextChar = true;
                                    isFirstChar = false;
                                }
                                else if(current == 'f' || current == 'F')
                                {
                                    toPrint = toPrint + current;
                                    readNextChar = true;
                                    isFirstChar = false;
                                }
                            }
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                if(!hasError)
                                {
                                    printLogical(toPrint, outputFile);
                                    toPrint.clear();
                                    qPosition = 0;
                                }
                                readNextChar = false;
                            }
                            else
                            {
                                toPrint = toPrint + current;
                                hasError = true;
                                readNextChar = true;
                            }
                            break;
                        }
                        case 8:
                        {
                            if(isFirstChar == true)
                            {
                                toPrint = toPrint + current;
                                readNextChar = true;
                                isFirstChar = false;
                            }
                            else if(ignoreUnlessComment.find(current) != std::string::npos)
                            {
                                if(symbolHasAtLeastOneChar)
                                {
                                    printSymbol(toPrint, outputFile);
                                    toPrint.clear();
                                    symbolHasAtLeastOneChar = false;
                                    qPosition = 0;
                                }
                                else
                                {
                                    hasError = true;
                                    readNextChar = false;
                                }
                            }
                            else
                            {
                                toPrint = toPrint + current;
                                symbolHasAtLeastOneChar = true;
                                readNextChar = true;
                            }
                            break;
                        }
                        case 19:
                        {
                            if(isFirstChar)
                            {
                                toPrint = toPrint + current;
                                isFirstChar = false;
                            }
                            else if(current == ' ')
                            {
                                toPrint = toPrint + "&nbsp;";
                            }
                            else if(current == '\t')
                            {
                                toPrint = toPrint + "&nbsp&nbsp&nbsp;";
                            }
                            else if(current == '\n')
                            {
                                printComment(toPrint, outputFile);
                                toPrint.clear();
                                qPosition = 0;
                            }
                            else
                            {
                                toPrint = toPrint + current;
                            }
                            readNextChar = true;
                            break;
                        }
                        // The char/set of chars constitutes a variable
                        case 21:
                        {
                            // Verifies if the current char is accepted in the state q1 of the automaton
                            if(q21.find(current) != std::string::npos)
                            {
                                toPrint = toPrint + current;
                                readNextChar = true;
                            }
                            // Prints the varible if the current char is a delimiter and the set has no mistakes
                            else if(delimiters.find(current) != std::string::npos)
                            {
                                if(!hasError)
                                {
                                    if(toPrint == "define")
                                    {
                                        printReservedWord(toPrint, outputFile);
                                    }
                                    else
                                    {
                                        printVariable(toPrint, outputFile);
                                    }
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
                    }
                }
                // Only the erros that need to be printed arrive here
                else 
                {
                    // Verifies if the current char is a delimiter, if false, it adds the char to the current set of chars
                    if(delimiters.find(current) == std::string::npos)
                    {
                        toPrint = toPrint + current;
                        readNextChar = true;
                    }
                    // The cause of the error was a invalid char in a certain state of the automaton, therefore, it prints the set of chars as a certain error depending on the state of the automaton 
                    else
                    {
                        printError(toPrint, outputFile);
                        toPrint.clear();
                        qPosition = 0;
                        hasError = false;
                    }
                }
            }
        }
        // Prints an end of line in the output file
        outputFile << "\t\t<span><br></span>" << std::endl;
    }
    printHtmlClosingTags(outputFile);

    // Closes the file that the user provided
    expressionsFile.close();

    // Closes the output file that we created
    outputFile.close();
}

int main(void)
{
    std::string fileName;
    std::cout << "\n |-|-|      DFA SYNTATIC HIGHLIGHTER      |-|-|" << std::endl;
    std::cout << "By: Aldo Degollado, Abraham Mendoza, and Alonso Martinez\n" << std::endl;
    std::cout << "\nInput the name of the file to analyze (with extension): ";
    std::cin >> fileName;

    auto t1 = std::chrono::high_resolution_clock::now();
    lexerArithmetic(fileName);
    auto t2 = std::chrono::high_resolution_clock::now();

    std::cout << "\n\n\nThe analysis of your file has ended, thank for using our program!\n" << std::endl;
    auto duration = std::chrono::duration_cast<std::chrono::seconds>(t2 - t1).count();
    std::cout << "It took " << duration << " seconds." << std::endl;

    return 0;
}