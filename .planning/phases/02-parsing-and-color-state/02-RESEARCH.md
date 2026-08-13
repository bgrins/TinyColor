# Phase 2 Research — Parsing and Color State

## Source facts

- TinyColor parses with `inputToRGB`: strings first become object-like fields,
  then RGB has precedence over HSV, which has precedence over HSL.
- `bound01` treats string `1.0` as `100%`, recognizes `%`, clamps before
  scaling, returns exactly 1 near the upper bound, and otherwise uses modulo.
- `boundAlpha` uses JavaScript `parseFloat`; non-numeric, negative, and >1
  values become 1.
- Its CSS unit and functional syntax are intentionally permissive: commas and
  parentheses are optional, whitespace can separate components, signs and
  decimal values are accepted, and matching is case-insensitive after lowercasing.
- Hex permits `#` optionally at 3, 4, 6, and 8 digits. Four/eight digit alpha
  converts from hex to `[0,1]` and receives format `hex8`.
- Named colors are the source `names` map; recognized names are converted to
  hex but retain source format `name`. `transparent` is special (`0,0,0,0`).
- Invalid colors remain black with alpha 1 and false validity rather than
  returning an exception.

## Design consequence

Make a private normalized model the only parser output. The public facade and
compatibility runner should consume that model rather than duplicate bounds,
format decisions, or name handling. The model should retain channel precision;
observable rounding belongs to Phase 3.

## Validation architecture

Run focused Go unit tests for model/bounds/parser and differential JSONL cases
through the existing Node runner. Use exact rendered/JSON values. Test parser
categories separately so a mismatch names `go/internal/parser` or
`go/internal/color`, not a vague package.

