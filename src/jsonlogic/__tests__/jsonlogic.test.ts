import { execJSONExpression } from "..";

const ctx = { data: {}, context: {} };
describe("JSON Logic Test cases::", () => {
	it("Negation operation : !", () => {
		expect(execJSONExpression(["!", 2], ctx)).toBe(false);
		expect(execJSONExpression(["!", true], ctx)).toBe(false);
		expect(execJSONExpression(["!", "Hello"], ctx)).toBe(false);
		expect(execJSONExpression(["!", false], ctx)).toBe(true);
	});
	it("Ternary Operation : ?:", () => {
		expect(execJSONExpression(["?:", [true, 1, 0]], ctx)).toBe(1);
		expect(execJSONExpression(["?:", [false, 1, 0]], ctx)).toBe(0);
		expect(
			execJSONExpression(["?:", [["&&", [1, true, "Hello"]], 1, 0]], ctx)
		).toBe(1);
	});

	// Variables.
	it("Variable", () => {
		expect(
			execJSONExpression(["var", ["$data", "name"]], {
				data: { name: "Kishore" },
				context: {},
			})
		).toBe("Kishore");
		expect(
			execJSONExpression(["var", ["$data", "likes[2].demo[0]"]], {
				data: {
					name: "Kishore",
					likes: [
						{ id: 1, posted_by: "Hello" },
						{ id: 2, posted_by: "Hey" },
						{ id: 1, posted_by: "Hello", demo: ["hello"] },
						{ id: 1, posted_by: "Hello" },
					],
				},
				context: {},
			})
		).toBe("hello");
	});

	it("Chained Assertion === Check.", () => {
		expect(execJSONExpression(["===", [1, 1, 1]], ctx)).toBe(true);
	});
	it("Chained Assertion === Check: Case sensitive", () => {
		expect(execJSONExpression(["===", [1, "1"]], ctx)).toBe(false);
	});

	it("Chained Assertion !== Check", () => {
		expect(execJSONExpression(["!==", [1, 1]], ctx)).toBe(false);
	});

	// > operator
	it("Chained Assertion > valid", () => {
		expect(execJSONExpression([">", [2, 1, 0, -1]], ctx)).toBe(true);
	});
	it("Chained Assertion > invalid", () => {
		expect(execJSONExpression([">", [2, 1, 0, 1]], ctx)).toBe(false);
	});
	it("Chained Assertion >= valid", () => {
		expect(execJSONExpression([">=", [3, 2, 2, 1]], ctx)).toBe(true);
	});
	it("Chained Assertion >= invalid", () => {
		expect(execJSONExpression([">=", [2, 1, 0, 1]], ctx)).toBe(false);
	});

	// < operator
	it("Chained Assertion < valid", () => {
		expect(execJSONExpression(["<", [0, 1, 2, 3, 4]], ctx)).toBe(true);
	});
	it("Chained Assertion < invalid", () => {
		expect(execJSONExpression(["<", [1, 1]], ctx)).toBe(false);
	});
	it("Chained Assertion <= invalid args", () => {
		expect(() => execJSONExpression(["<=", [0]], ctx)).toThrow();
		expect(() => execJSONExpression(["<=", []], ctx)).toThrow();
	});
	it("Chained Assertion <= valid", () => {
		expect(execJSONExpression(["<=", [0, 1, 2, 2, 4]], ctx)).toBe(true);
	});
	it("Chained Assertion <= invalid", () => {
		expect(execJSONExpression(["<=", [1, 1, -1]], ctx)).toBe(false);
	});

	// Chained Operations.
	it("Chained Operation: ||", () => {
		expect(execJSONExpression(["||", [true, false]], ctx)).toBe(true);
		expect(execJSONExpression(["||", [false, false]], ctx)).toBe(false);
	});
	it("Chained Operation: &&", () => {
		expect(execJSONExpression(["&&", [true, true]], ctx)).toBe(true);
		expect(execJSONExpression(["&&", [true, false]], ctx)).toBe(false);
	});
	it("Chained Operation: +", () => {
		expect(execJSONExpression(["+", [1, 3, 5]], ctx)).toBe(9);
	});
	it("Chained Operation: -", () => {
		expect(execJSONExpression(["-", [10, 3]], ctx)).toBe(7);
	});
	it("Chained Operation: *", () => {
		expect(execJSONExpression(["*", [2, 5]], ctx)).toBe(10);
	});
	it("Chained Operation: /", () => {
		expect(execJSONExpression(["/", [4, 2]], ctx)).toBe(2);
	});
	it("Chained Operation: %", () => {
		expect(execJSONExpression(["%", [5, 2]], ctx)).toBe(1);
	});
});
