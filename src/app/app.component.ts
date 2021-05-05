import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {
  
  title = 'canvas-playground';

  projectDisplayed: string = '';

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private globalService: GlobalService,) {}

  ngAfterViewChecked()
  {
    this.changeDetectorRef.detectChanges();
  }

  selectProject(selection: any) {
    this.globalService.debug("AppComponent - selected project", selection);
    this.projectDisplayed = selection;
  }
}
