package compat

import (
	"encoding/json"
	"fmt"
)

type Request struct {
	ID        string `json:"id"`
	Operation string `json:"operation"`
	Input     any    `json:"input"`
	Args      any    `json:"args,omitempty"`
}

type Response struct {
	ID        string `json:"id"`
	Result    any    `json:"-"`
	Error     string `json:"-"`
	hasResult bool
}

func Success(id string, result any) (Response, error) {
	response := Response{ID: id, Result: result, hasResult: true}
	return response, response.Validate()
}

func Failure(id, message string) (Response, error) {
	response := Response{ID: id, Error: message}
	return response, response.Validate()
}

func (r Response) Validate() error {
	if r.hasResult == (r.Error != "") {
		return fmt.Errorf("response must contain exactly one of result or error")
	}
	return nil
}

func (r Response) MarshalJSON() ([]byte, error) {
	if err := r.Validate(); err != nil {
		return nil, err
	}
	if r.hasResult {
		return json.Marshal(struct {
			ID     string `json:"id"`
			Result any    `json:"result"`
		}{r.ID, r.Result})
	}
	return json.Marshal(struct {
		ID    string `json:"id"`
		Error string `json:"error"`
	}{r.ID, r.Error})
}

func Decode(line []byte) (Request, error) {
	var request Request
	if err := json.Unmarshal(line, &request); err != nil {
		return Request{}, fmt.Errorf("malformed JSON")
	}
	if request.ID == "" || request.Operation == "" {
		return Request{}, fmt.Errorf("id and operation are required")
	}
	return request, nil
}

func Encode(response Response) ([]byte, error) {
	if err := response.Validate(); err != nil {
		return nil, err
	}
	return json.Marshal(response)
}
