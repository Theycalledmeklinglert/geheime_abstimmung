import {Question} from "../../data-access/models/question";
import {EditorComponent} from "./editor.component";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {BackendService} from "../../data-access/service/backend.service";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {click} from "../../../element.spec-helper";
import {HttpClient, HttpHandler} from "@angular/common/http";




describe('EditorComponent', () => {
  let fixture: ComponentFixture<EditorComponent>;
  let debugElement: DebugElement;
  let questions: Question[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      providers:[BackendService, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(EditorComponent);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  })

  it('deletes given question',  () => {
    // Arrange
    let questionToDelete: Question = {id: 1, title: "",type:"", visible: true};
    // Act
    click(fixture, 'id', 'deleteQuestion');
    fixture.detectChanges();
    let questions = fixture.componentInstance.poll.questions;
    // Assert
    expect(questions).toEqual([]);
  });

  it("adds an empty question, sets it to visible and sets former to not visible", () =>{
    //Act
    click(fixture, 'id', 'addQuestion');
    fixture.detectChanges();
    let questions = fixture.componentInstance.poll.questions;
    //Assert
    expect(questions.length).toEqual(2);
    expect(questions[0].visible).toEqual(false);
    expect(questions[1]).toEqual({id: 2, title: "",type:"", visible: true})
  })

  it("adds an valid email from tempEmail", () =>{
      //Arrange
      fixture.componentInstance.tempEmail = 'test@fhws.de';
      //Act
      fixture.componentInstance.addEmail();
      fixture.detectChanges();
      let emails = fixture.componentInstance.poll.emails;
      //Assert
      expect(emails.length).toEqual(1);
      expect(emails[0]).toEqual('test@fhws.de');
      expect(fixture.componentInstance.tempEmail).toEqual('');
  })

  it("discards an invalid email from tempEmail", () =>{
    //Arrange
    fixture.componentInstance.tempEmail = 'invalid';
    //Act
    fixture.componentInstance.addEmail();
    fixture.detectChanges();
    let emails = fixture.componentInstance.poll.emails;
    //Assert
    expect(emails.length).toEqual(0);
  })

  it("deletes an email", () =>{
    //Arrange
    fixture.componentInstance.tempEmail = 'test@fhws.de';
    //Act
    fixture.componentInstance.addEmail();
    fixture.componentInstance.deleteEmail("test@fhws.de")
    fixture.detectChanges();
    let emails = fixture.componentInstance.poll.emails;
    //Assert
    expect(emails.length).toEqual(0);
  })

  it("checks poll for missing input, none missing", ()=>{
    //Arrange
    fixture.componentInstance.poll = {
      name: "Testpoll",
      lifetime: "2022-06-05T22:15",
      questions: [{id: 1, title: "Was geht ab?",type:"yesNo", visible: true}],
      emails: ["test@fhws.de"]
    }
    //Act
    fixture.detectChanges();
    let isComplete: boolean = fixture.componentInstance.isCompleteVote();
    //Assert
    expect(isComplete).toBe(true);
  })

  it("checks poll for missing input, title missing", ()=>{
    //Arrange
    fixture.componentInstance.poll = {
      name: "",
      lifetime: "2022-06-05T22:15",
      questions: [{id: 1, title: "Was geht ab?",type:"yesNo", visible: true}],
      emails: ["test@fhws.de"]
    }
    //Act
    fixture.detectChanges();
    let isComplete: boolean = fixture.componentInstance.isCompleteVote();
    //Assert
    expect(isComplete).toBe(false);
  })

  it("deleted everything when pressing back to main", () =>{
    //Arrange
    fixture.componentInstance.poll = {
      name: "",
      lifetime: "2022-06-05T22:15",
      questions: [{id: 1, title: "Was geht ab?",type:"yesNo", visible: true}],
      emails: ["test@fhws.de"]
    }
    //Act
    click(fixture, "class", "returnToMainButton");
    fixture.detectChanges();
    let newPoll = fixture.componentInstance.poll;
    expect(newPoll).toEqual({
      name: "",
      lifetime: "",
      questions: [{id: 1, title: "New Question",type:"", visible: true}],
      emails: []
    });
  })
});

// it("shows an selected question", () =>{
//   //Act
//   click(fixture, 'id', 'addQuestion');
//   click(fixture, 'class', 'questiontitle');
//   fixture.detectChanges();
//   let question = fixture.componentInstance.vote.questions;
//
//   expect(questions[0].visible).toEqual(true);
// })
