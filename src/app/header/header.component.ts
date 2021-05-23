import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  @Output() projectNameEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('ProjectRangeInput')
  private projectRangeInput!: ElementRef<HTMLInputElement>;

  chosenProject: string = "";
  projects: string[] = [
    "Introduction",
    "Experiment",
    "Pixel Rain",
    "Particle Text",
  ];

  constructor(
    private globalService: GlobalService,) { }

  ngAfterViewInit(): void {
    this.chosenProject = this.projects[environment.defaultProject];
    this.projectNameEvent.emit(this.projects[environment.defaultProject]);
    this.projectRangeInput!.nativeElement.value = ''+ environment.defaultProject;
  }

  updateProjectChoice(value: any) {
    this.chosenProject = this.projects[value];
    this.projectNameEvent.emit(this.projects[value]);
  }// ==============================

}// ==============================
