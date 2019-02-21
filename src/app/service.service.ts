import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Category } from 'src/entity/Category';
import { Level } from 'src/entity/Level';
import { Question } from 'src/entity/Question';
import { Tag } from 'src/entity/Tag';
import { TypeQuestion } from 'src/entity/TypeQuestion';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private url = "http://localhost:8080/";
  private fakedata ="http://localhost:3000/"
  private baseUrl = 'http://localhost:8080/tag';
  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    })
  }

  // "Access-Control-Allow-Methods ": "PATCH",
  constructor(
    private http: HttpClient
  ) { }

  //==========QUESTION=============
  //get question ang pagination
  getQuestions(p: string, s: string): Observable<Question[]> {
    return this.http.get<Question[]>(this.url + `question/pagination?page=${p}&size=${s}`).pipe(
      tap()
    )
  }
  //get question sum
  getQuestionSum(): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(this.url + `question/sum`, { observe: 'response' }).pipe(
      tap(resp => resp.headers.get('SumQuestion'))
    );
  }

  //====== get list question by contents=====
  getListQuestionByContent(content: String): Observable<Question[]> {
    return this.http.get<Question[]>(this.url + `question/search-by-content/${content}`).pipe(
      tap(),
      catchError(er => of([]))
    );
  }
  //create question
  createQuestion(question:Question): Observable<Question>{
    return this.http.post<Question>(this.url + `question/add`, question).pipe(
      tap(),
      catchError(er => of(new Question()))
    );
  }
  //update multi question
  updateMutilQuestion(question: Question, id: string): Observable<Question> {
    return this.http.put<Question>(this.url + `question/edit/${id}`, question, this.httpOption).pipe(
      tap(),
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
    );
  }

  //==========LEVEL=============
  //get all level
  getAllLvl(): Observable<Level[]> {
    return this.http.get<Level[]>(this.url + `level`).pipe(
      tap(),
      catchError(er => of([]))
    );
  }
  //==========CATEGORY=============
  getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + `category`).pipe(
      tap(),
      catchError(er => of([]))
    );
  }
  //==========Category
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
    return this.http.post(this.url + `category`, category);
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
    return this.http.get<Tag[]>(this.baseUrl ).pipe(
      tap(),
      catchError(er => of([]))
    );
  }
  //get tag
  getTag(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  // create tag
  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.baseUrl + `/add`, tag);
  }
  //===========TYPE=============
  getType(): Observable<TypeQuestion[]> {
    return this.http.get<TypeQuestion[]>(this.url + `type`).pipe(
      tap(),
      catchError(e => of([]))
    );
  }
}
