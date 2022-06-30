import {Question} from "../../data-access/models/question";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {BackendService} from "../../data-access/service/backend.service";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {click} from "../../../element.spec-helper";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {PollResultComponent} from "./pollResult.component";




describe('PollResultComponent', () => {
  let fixture: ComponentFixture<PollResultComponent>;
  let debugElement: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollResultComponent],
      providers:[BackendService, HttpClient, HttpHandler, EncryptionService]
    }).compileComponents();
    fixture = TestBed.createComponent(PollResultComponent);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  })

  it('fetches the Poll ID from browser local storage',  () => {
    // Arrange
    localStorage.setItem("clickedPoll", "12345");
    // Act
    let fetchedId = fixture.componentInstance.getIDofClickedPoll();
    // Assert
    expect(fetchedId).toEqual("12345");
  });

  it("decrements counter on false private key input", () =>{
    //Arrange
    fixture.componentInstance.tempPrivKey = "false";
    //Act
    click(fixture, "id", "enterButton");
    fixture.detectChanges();
    //Assert
    expect(fixture.componentInstance.enterCounter).toEqual(4);
    expect(fixture.componentInstance.tempPrivKey).toEqual('');
  })

  it("deleted poll on fifth false private key input", () =>{
    //Arrange
    fixture.componentInstance.tempPrivKey = "false";
    fixture.componentInstance.enterCounter = 1;
    //Act
    click(fixture, "id", "enterButton");
    // fixture.detectChanges();
    //Assert
    expect(fixture.componentInstance.enterCounter).toEqual(0);
    expect(fixture.componentInstance.poll).toBeUndefined();
  })

  it("sets values for the pie chart after successful key input", () =>{
    //Arrange
    fixture.componentInstance.tempPrivKey = "Swordfish";
    //Act
    click(fixture, "id", "enterButton");
    fixture.detectChanges();
    //Assert
    // this.answers = this.poll.questions[this.questionCount].fixedAnswers
    expect(fixture.componentInstance.chartOptions).toEqual({
      series: [69.420, 10.13, 20.87],
      chart: {type: "donut"}, labels: fixture.componentInstance.poll.questions[fixture.componentInstance.questionCount].fixedAnswers,
      responsive: [{breakpoint: 480, options: {chart: {width: 400}, legend: {position: "top", horizontalAlign:"left"}}}]});
  })


  it("initializes with five trials for key input", () =>{
    //Arrange
    //Act
    //Assert
    expect(fixture.componentInstance.enterCounter).toEqual(5);
  })
  it("", () =>{
    //Arrange

    //Act

  })
});
