import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ActivityLog } from '../../../models/index';
import { ActivityLogService, FeatureToggleService } from '../../../services/index';

@Component({
  selector: 'smui-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnChanges {
  @Input() selectedListItem = null;

  @Output() showErrorMsg: EventEmitter<string> = new EventEmitter();

  private show = false;
  private detailInputId: string = null;
  private activityLog: ActivityLog = null;

  constructor(
    private activityLogService: ActivityLogService,
    private featureToggleService: FeatureToggleService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('In DetailActivityLog :: ngOnChanges');

    if (this.selectedListItem) {
      this.detailInputId = this.selectedListItem.id;
      // reload activity log
      if (this.show) {
        this.activityLog = null;
        this.loadActivityLog();
      }
    }
  }

  public loadActivityLog() {
    if (this.detailInputId !== null) {
      console.log('In DetailActivityLog :: loadActivityLog with detailInputId')
      this.activityLogService.getActivityLog(this.detailInputId)
        .then(retActivityLog => {
          console.log(':: retActivityLog received')
          this.activityLog = retActivityLog
        })
        .catch(error => this.showErrorMsg.emit(error));
    }
  }

  public isFeatureActive() {
    return this.featureToggleService.getSyncToggleActivateEventHistory();
  }

  public toggleShow() {
    this.show = !this.show;

    if (this.show) {
      this.loadActivityLog();
      // TODO this only needs once per input, not for every toggle...toggle...
    }
  }

}
