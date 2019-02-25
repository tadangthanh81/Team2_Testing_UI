import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Category } from 'src/entity/Category';
import { Level } from 'src/entity/Level';
import { Question } from 'src/entity/Question';    
import { Tag } from 'src/entity/Tag';
import { TypeQuestion } from 'src/entity/TypeQuestion';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private url = "http://localhost:8081/";
  private fakedata = "http://localhost:3000/"
  private baseUrl = 'http://localhost:8081/api/tag';
  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": "123123",
      observe: 'response'
    })
  }

  // "Access-Control-Allow-Methods ": "PATCH",
  constructor(
    private http: HttpClient
  ) { }

  //========Hander Exception============
    errorHander(error: HttpErrorResponse){
      return throwError(error || "Server Error!");
    }

  //==========QUESTION=============
  //get question ang pagination
  getQuestions(p: string, s: string): Observable<Question[]> {
    return this.http.get<Question[]>(this.url + `question/pagination?page=${p}&size=${s}`).pipe(
      tap(),
      catchError(this.errorHander)
    )
  }

  //get question sum
  getQuestionSum(): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(this.url + `question/sum`, { observe: 'response' }).pipe(
      tap(resp => resp.headers.get('SumQuestion')),
      catchError(this.errorHander)
    );
  }
  countSearchQuestion(content: string): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(this.url + `question/count-search-question?content=${content}`, { observe: 'response' }).pipe(
      tap(resp => resp.headers.get('CountSearchQuestion')),
      catchError(this.errorHander)
    );
  }

  //get category sum
  getCategorySum(): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(this.url + `category/sum`, { observe: 'response' }).pipe(
      tap(resp => resp.headers.get('SumCategory')),
      catchError(this.errorHander)
    );
  }

  //====== get list question by contents=====
  searchQuestionByContent(content: string, p: string, s: string): Observable<Question[]> {
    return this.http.get<Question[]>(this.url + `question/search-by-content?contentSearch=${content}&page=${p}&size=${s}`).pipe(
      tap(),
      catchError(this.errorHander)
    );
  }

  //====== get list question by contents=====
  getListCategoryByContent(content: String): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + `category/search-by-content/${content}`).pipe(
      tap(),
      catchError(this.errorHander)
    );
  }
  //create question
  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.url + `question/add`, question).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(er => of(new Question()))
    );
  }
  //get question by id
  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(this.url + `question/${id}`).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(er => of(new Question()))
    );
  }
  //update multi question
  updateMutilQuestion(question: Question, id: string): Observable<Question> {
    return this.http.put<Question>(this.url + `question/edit/${id}`, question, this.httpOption).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(e => of(new Question())),
    );
  }

  updateMutilQuestion1(question: Question): Observable<Question> {
    return this.http.put<Question>(this.url + `question/edit`, question).pipe(
      tap(),
      catchError(e => {
        console.log(e);
        return of(new Question());
      }),
      catchError(this.errorHander)
    );
  }

  //==========LEVEL=============
  //get all level
  getAllLvl(): Observable<Level[]> {
    return this.http.get<Level[]>(this.url + `level`).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(er => of([]))
    );
  }
  //==========CATEGORY=============
  //get category ang pagination
  getCategorys(p: string, s: string): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + `category/pagination?page=${p}&size=${s}`).pipe(
      tap(),
      catchError(this.errorHander)
    )
  }
  getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + `category`).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(er => of([]))
    );
  }
    //====== get list question by contents=====
    searchCategoryByContent(content: string, p: string, s: string): Observable<Category[]> {
      return this.http.get<Category[]>(this.url + `category/search-by-content?contentSearch=${content}&page=${p}&size=${s}`).pipe(
        tap(),
        catchError(this.errorHander),
        catchError(er => of([]))
      );
    }

    countSearchCategory(content: string): Observable<HttpResponse<Object>> {
      return this.http.get<HttpResponse<Object>>(this.url + `category/count-search-category?content=${content}`, { observe: 'response' }).pipe(
        tap(resp => resp.headers.get('CountSearchCategory')),
        catchError(this.errorHander)
      );
    }

  // lay danh sach Category
  getCategoryList() {
    return this.http.get<Category[]>(this.url + `category`);
  }

  // lay tung Category theo id
  getCategory(id: number) {
    return this.http.get<Category>(`${this.url + `category`}/${id}`);
  }

  // them moi category
  createCategory(category: Category) {
    return this.http.post(this.url + `category`, category, this.httpOption);
  }

  // edit category theo id
  updateCategory(id: number, category: Category) {
    return this.http.patch(this.url + `category/${id}`, category);
  }

  // delete category theo id
  deleteCategory(id: number) {
    return this.http.delete(this.url + `category/${id}`);
  }
  //==========TAG=============
  getAllTag(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.url + `tag`).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(er => of([]))
    );
  }
  //==========TYPE=============
  getAllType(): Observable<TypeQuestion[]> {
    return this.http.get<TypeQuestion[]>(this.url + `type`).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(er => of([]))
    );
  }

  getTag(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createTag(tag: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}` + `/create`, tag);
  }
  //===========TYPE=============
  getType(): Observable<TypeQuestion[]> {
    return this.http.get<TypeQuestion[]>(this.url + `type`).pipe(
      tap(),
      catchError(this.errorHander),
      catchError(e => of([]))
    );
  }
}
