import { parse } from 'graphql'

export default function (body) {
    const parsedQuery = parse(body.query)
    const fieldName = firstFieldValueNameFromOperation(firstOperationDefinition(parsedQuery))
    const operation = firstOperationDefinition(parsedQuery).operation

	function firstOperationDefinition (ast) {
        return ast.definitions[0]
    }

    function firstFieldValueNameFromOperation (operationDefinition) {
        return operationDefinition.selectionSet.selections[0].name.value
    }

    if(Object.keys(body.variables).length == 0) {
        return {
            operation,
            fieldName,
            variables: null,
        }
    }

    const variables = variablesParser(firstOperationDefinition(parsedQuery))

    function variablesParser (operationDefinition) {
        const argsDefinition = operationDefinition.selectionSet.selections[0].arguments

        for(let arg of argsDefinition) {
            const argName = arg?.name?.value
            const paramName = arg?.value?.name?.value

            if(arg.value.kind !== 'Variable') {
                throw new Error(`The ${argName} argument of ${fieldName} ${operation} must be Variable! Entered ${arg.value.kind}`)
            }

            if(argName !== paramName) {
                throw new Error(`The value of ${argName} argument of ${fieldName} ${operation} must be $${argName}. Entered $${paramName}`)
            }
        }
        
        return body.variables
    }
 
    return {
    	operation,
    	fieldName,
        variables,
    }
}