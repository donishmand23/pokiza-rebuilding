import pkg from 'graphql'
const { parse, valueFromAST, parseValue } = pkg
// console.log(pkg.Kind)
function queryParser (body) {
	const firstOperationDefinition = (ast) => ast.definitions[0]
    const firstFieldValueNameFromOperation = (operationDefinition) => {
        console.log(body)
    	// console.log(operationDefinition.variableDefinitions[0].)
        // const args = {}
        // for(let arg of operationDefinition.selectionSet.selections[0].arguments) {
        //     args[arg.name.value]
        //     console.log(arg)
        // }
        // console.log(operationDefinition.selectionSet.selections[0].arguments)
    	return operationDefinition.selectionSet.selections[0].name.value
    }
    const parsedQuery = parse(body.query)
    // console.log(body)
    // console.log( pkg.parseValue((new pkg.Source(body.query)).body) )
    return {
    	operation: firstOperationDefinition(parsedQuery).operation,
    	fieldName: firstFieldValueNameFromOperation(firstOperationDefinition(parsedQuery)),
    }
}

export default function ({ req }) {

	// queryParser(req.body)

    return { agent: req['headers']['user-agent'] }
}