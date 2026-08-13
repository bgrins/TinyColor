package compat

import (
	"strings"
	"testing"
)

func TestResponseHasExactlyOnePayload(t *testing.T) {
	if _, err := Success("one", map[string]any{"ok": true}); err != nil {
		t.Fatal(err)
	}
	if _, err := Failure("one", "bad request"); err != nil {
		t.Fatal(err)
	}
	if err := (Response{ID: "one"}).Validate(); err == nil {
		t.Fatal("expected neither payload error")
	}
	if err := (Response{ID: "one", Error: "bad", hasResult: true}).Validate(); err == nil {
		t.Fatal("expected both payloads error")
	}
}

func TestFalseResultIsPresent(t *testing.T) {
	response, _ := Success("no", false)
	encoded, err := Encode(response)
	if err != nil || !strings.Contains(string(encoded), `"result":false`) {
		t.Fatalf("%s %v", encoded, err)
	}
}
