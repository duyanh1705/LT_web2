package com.nguyenduyanh.example05.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.nguyenduyanh.example05.payloads.ApiResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class MyGlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> resourceNotFoundExceptionHandler(ResourceNotFoundException e){
        String message = e.getMessage();
        ApiResponse apiResponse = new ApiResponse(message, false);
        return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.NOT_FOUND);
    }
@ExceptionHandler(APIException.class)
public ResponseEntity<ApiResponse> myAPIException(APIException e){
    String message = e.getMessage();
    ApiResponse res = new ApiResponse(message, false);
    return new ResponseEntity<ApiResponse>(res, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> myMethodArgsNotValidException(MethodArgumentNotValidException e) {
        Map<String, String> res  = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(err -> {
            String fieldName = ((FieldError) err).getField();
            String message = err.getDefaultMessage();
            res.put(fieldName, message);
        });
        return new ResponseEntity<Map<String, String>>(res, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> myConstrainsVoilationException(ConstraintViolationException e) {
        Map<String, String> res  = new HashMap<>();

        e.getConstraintViolations().forEach(voilation -> {
            String fieldName = voilation.getPropertyPath().toString();
            String message = voilation.getMessage();
            res.put(fieldName, message);
        });
        return new ResponseEntity<Map<String, String>>(res, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> myAuthenticationException(AuthenticationException e){

        String res = e.getMessage();
        return new ResponseEntity<String>(res, HttpStatus.BAD_REQUEST);
    }
@ExceptionHandler(MissingPathVariableException.class)
public ResponseEntity<ApiResponse> myMissingPathVariableException(MissingPathVariableException e){
    ApiResponse res= new ApiResponse(e.getMessage(), false);
    return new ResponseEntity<ApiResponse>(res, HttpStatus.BAD_REQUEST);
}
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse> myDataIntegrityViolationException(DataIntegrityViolationException e){
        ApiResponse res = new ApiResponse(e.getMessage(), false);
        return new ResponseEntity<ApiResponse>(res, HttpStatus.BAD_REQUEST);
    }
}
