import { createToken } from "../../src/scan/tokens_public"
import { Lexer } from "../../src/scan/lexer_public"

describe("The Chevrotain Lexer Optimizations", () => {
    it("Will re-attempt none 'optimized' patterns if the optimization failed", () => {
        // won't be automatically optimized due to the '|' meta characters
        const Boolean = createToken({
            name: "Boolean",
            pattern: /true|false/,
            // But we provide the hints so it can be optimized
            start_chars_hint: ["t", "f"]
        })
        // simple string can perform optimization
        const Function = createToken({ name: "Function", pattern: "function" })
        // won't be optimized due to the '\w' and '+'
        const Name = createToken({ name: "False", pattern: /\w+/ })

        const WhiteSpace = createToken({
            name: "WhiteSpace",
            pattern: /\s+/,
            group: Lexer.SKIPPED,
            line_breaks: true
        })

        const allTokens = [WhiteSpace, Boolean, Function, Name]
        const JsonLexer = new Lexer(allTokens)
        const lexResult = JsonLexer.tokenize("fool")
        expect(lexResult.tokens).to.have.lengthOf(1)
        expect(lexResult.tokens[0].tokenType).to.equal(Name)
    })

    it("Will", () => {
        expect(() =>
            createToken({
                name: "Boolean",
                pattern: /true|false/,
                // hints can only be one character long.
                start_chars_hint: ["true", "f"]
            })
        ).to.throw(
            "All <start_chars_hint elements> must be single character strings"
        )
    })
})
