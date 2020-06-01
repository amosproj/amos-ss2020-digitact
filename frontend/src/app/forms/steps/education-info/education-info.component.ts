/*
  @description
    This component renders the education information step view and its actions.
*/
import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { FormControl, FormGroup } from '../../../common/forms/forms';
import { EducationInfoEntry, FormsData } from '../../../model/forms-data.model';
import { EducationInfoEntryComponent } from '../education-info-entry/education-info-entry.component';

@Component({
  selector: 'form-education-info',
  templateUrl: './education-info.component.html',
  styleUrls: ['./education-info.component.scss'],
})
export class EducationInfoComponent {
  @Input()
  formsData: FormGroup<FormsData>;
  eduInfo = new FormGroup<EducationInfoEntry>({
    university: new FormControl('', Validators.required),
    degree: new FormControl('', Validators.required),
    typeOfDegree: new FormControl('', Validators.required),
    grade: new FormControl('', Validators.required),
    gradDate: new FormControl('', Validators.required),
  });

  eduInfoArr: DeepPartial<EducationInfoEntry>[];

  /**
   * Constructor
   */
  constructor(public modalController: ModalController) {
    this.eduInfoArr = [];
  }

  /**
   * Open education info entry
   */
  // tslint:disable-next-line: typedef
  async presentEduInfo(): Promise<void> {
    const modal = await this.modalController.create({
      component: EducationInfoEntryComponent,
      componentProps: {
        edu: this.eduInfo,
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });
    modal.onDidDismiss().then((val) => {
      // const res = Object.entries(this.eduInfo);
      // console.log('hey');
      // console.log(res);
      if (val.data.canSubmitData) {
        this.formsData.controls.educationInfo.controls.eduInfo.push(
          this.eduInfo
        );
      }
      this.eduInfo.reset();
      console.log(
        val.data.canSubmitData,
        val,
        this.eduInfo,
        this.formsData.controls.educationInfo.controls.eduInfo
      );
    });
    return await modal.present();
  }
  async presentStoredInfo(
    eduStored: EducationInfoEntry,
    index: number
  ): Promise<void> {
    console.log(eduStored.university);
    const e = new FormGroup<EducationInfoEntry>({
      university: new FormControl(eduStored.university, Validators.required),
      degree: new FormControl(eduStored.degree, Validators.required),
      typeOfDegree: new FormControl(
        eduStored.typeOfDegree,
        Validators.required
      ),
      grade: new FormControl(eduStored.grade, Validators.required),
      gradDate: new FormControl(eduStored.gradDate, Validators.required),
    });
    const modal = await this.modalController.create({
      component: EducationInfoEntryComponent,
      componentProps: {
        edu: e,
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });
    modal.onDidDismiss().then((val) => {
      if (val.data.canSubmitData) {
        // this.formsData.controls.educationInfo.controls.eduInfo[index] = e;
        this.eduInfoArr[index] = e.value;
      }
      console.log(val.data.canSubmitData, val, e, this.eduInfoArr);
    });
    return await modal.present();
  }

  deleteInfo(index: number): void {
    //  this.eduInfoArr.splice(index, 1);
    this.formsData.controls.educationInfo.controls.eduInfo.removeAt(index);
  }
}
type DeepPartial<T> = {
  [key in keyof T]?: DeepPartial<T[key]>;
};
