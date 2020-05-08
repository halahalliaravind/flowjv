import get from "lodash/get";

export type IJSONOperation =
	| IJSONDataAccessOperation
	| IJSONNegationOperation
	| IJSONTernaryOperation
	| IJSONChainedOperation;

export type IJSONDataAccessOperation = [
	"var",
	["$data" | "$context", string, string?]
];
export type IJSONNegationOperation = ["!", IJSONExpression];
export type IJSONTernaryOperation = [
	"?:",
	[IJSONExpression, IJSONExpression, IJSONExpression]
];
export type IJSONChainedOperation =
	| ["===", IJSONExpression[]]
	| ["!==", IJSONExpression[]]
	| [">", IJSONExpression[]]
	| [">=", IJSONExpression[]]
	| ["<", IJSONExpression[]]
	| ["<=", IJSONExpression[]]
	| ["||", IJSONExpression[]]
	| ["&&", IJSONExpression[]]
	| ["+", IJSONExpression[]]
	| ["-", IJSONExpression[]]
	| ["*", IJSONExpression[]]
	| ["/", IJSONExpression[]]
	| ["%", IJSONExpression[]]
	| ["str:fmt:email", IJSONExpression[]];

export type IJSONExpression = number | string | boolean | IJSONOperation;

export const execJSONExpression = <IData, IContext>(
	logic: IJSONExpression,
	data: { data: IData; context: IContext }
): any => {
	if (
		typeof logic === "number" ||
		typeof logic === "string" ||
		typeof logic === "boolean"
	) {
		return logic;
	}
	switch (logic[0]) {
		case "var": {
			const [type, value, defaultValue] = logic[1];
			if (type === "$data") {
				return get(data.data, value, defaultValue);
			} else {
				return get(data.context, value, defaultValue);
			}
		}
		case "!": {
			return !execJSONExpression(logic[1], data);
		}

		// Logical operators
		case "?:": {
			const [cond, case1, case2] = logic[1];
			if (execJSONExpression(cond, data)) {
				return execJSONExpression(case1, data);
			}
			return execJSONExpression(case2, data);
		}

		// ASSERT CHAIN OPS
		case "===": {
			return helper.assertChainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 === v2
			);
		}
		case "!==": {
			return helper.assertChainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 !== v2
			);
		}
		case ">": {
			return helper.assertChainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 > v2
			);
		}
		case ">=": {
			return helper.assertChainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 >= v2
			);
		}
		case "<": {
			return helper.assertChainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 < v2
			);
		}
		case "<=": {
			return helper.assertChainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 <= v2
			);
		}

		// CHAIN OPS
		case "||": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 || v2
			);
		}
		case "&&": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 && v2
			);
		}
		case "+": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 + v2
			);
		}
		case "-": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 - v2
			);
		}
		case "*": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 * v2
			);
		}
		case "/": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 / v2
			);
		}
		case "%": {
			return helper.chainOp(
				helper.mapExpToValue(logic[1], data),
				(v1, v2) => v1 % v2
			);
		}
		case "str:fmt:email": {
			throw new Error("Need to implement still.");
		}
	}
};

const helper = {
	mapExpToValue: (exps: IJSONExpression[], data: any) => {
		return exps.map((exp) => execJSONExpression(exp, data));
	},
	chainOp: (values: any[], operation: (v1: any, v2: any) => any) => {
		if (values.length <= 1) {
			throw new Error("Atleast 2 values should be present.");
		}
		return values.reduce(
			(agg, v, i) => (i === 0 ? agg : operation(agg, v)),
			values[0]
		);
	},
	assertChainOp: (
		values: any[],
		operation: (v1: any, v2: any) => boolean
	) => {
		if (values.length <= 1) {
			throw new Error("Atleast 2 values should be present.");
		}
		for (let i = 1; i < values.length; i++) {
			if (!operation(values[i - 1], values[i])) {
				return false;
			}
		}
		return true;
	},
};
