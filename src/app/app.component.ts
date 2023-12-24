import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Mythras Roller';

  skill = 100;
  augmented = 0;
  opponent = 0;

  MINIMUM_VALUE = 0;
  MAXIMUM_VALUE = 200;

  result: number | undefined;
  resultGrade: string | undefined;

  grades = [
    'Normal',
    'Very Easy',
    'Easy',
    'Hard',
    'Formidable',
    'Herculean',
    'Hopeless',
  ];
  successLevels = getSuccessLevel();
  successLevelIcons = getSuccessLevelIcons();

  getSuccessLevels(difficultyGradeIndex: number) {
    let skillModified = calculateSkillByGrade(
      this.skill,
      this.augmented,
      this.opponent,
      difficultyGradeIndex
    );
    return [
      getSuccess(skillModified),
      getCrit(skillModified, this.augmented),
      getFumble(skillModified, this.augmented),
    ];
  }

  setSkill() {
    if (this.skill < this.MINIMUM_VALUE) this.skill = this.MINIMUM_VALUE;
    else if (this.skill > this.MAXIMUM_VALUE) this.skill = this.MAXIMUM_VALUE;
  }

  setAugmentedSkill() {
    if (this.augmented < this.MINIMUM_VALUE)
      this.augmented = this.MINIMUM_VALUE;
    else if (this.augmented > this.MAXIMUM_VALUE)
      this.augmented = this.MAXIMUM_VALUE;
  }

  setOpponentSkill() {
    if (this.opponent < this.MINIMUM_VALUE) this.opponent = this.MINIMUM_VALUE;
    else if (this.opponent > this.MAXIMUM_VALUE)
      this.opponent = this.MAXIMUM_VALUE;
  }

  rollResult(difficultyGradeIndex: number) {
    this.result = Math.floor(Math.random() * 100)+1;
    this.resultGrade = getResultGrade(
      difficultyGradeIndex,
      this.skill,
      this.augmented,
      this.opponent,
      this.result
    );
  }

  focusInput($event: any) {
    $event.target.select();
  }
}

function getSuccessLevel() {
  return [1, 2, 1.5, 1 / 3, 0.5, 0.1, 0];
}

function getCrit(skill: number, augmented?: number): number {
  let val = Math.ceil(removeAugmentation(skill, augmented) / 10);
  if (val == 0) return 0;
  return Math.max(val, 1);
}

function getSuccess(skill: number): number {
  let val = Math.ceil(skill);
  if (val == 0) return 0;
  return Math.min(Math.max(val, 5), 95);
}

function getFumble(skill: number, augmented?: number): number {
  let val = Math.ceil(removeAugmentation(skill, augmented));
  if (val > 100) return 100;
  return 99;
}

function calculateSkill(
  skill: number,
  augmented: number,
  opponent: number
): number {
  let newVal = skill + getActualAugmentation(augmented);
  if ((opponent != undefined && opponent > 100) || newVal > 100)
    newVal -= Math.max(opponent, newVal) - 100;
  return newVal;
}

function calculateSkillByGrade(
  skill: number,
  augmented: number,
  opponent: number,
  difficultyGradeIndex: number
) {
  return (
    calculateSkill(skill, augmented, opponent) *
    getSuccessLevel()[difficultyGradeIndex]
  );
}

function getActualAugmentation(skill: number | undefined): number {
  if (skill) return skill * 0.2;
  return 0;
}

function removeAugmentation(skill: number, augmented: number | undefined) {
  return skill - getActualAugmentation(augmented);
}

function getResultGrade(
  difficultyGradeIndex: number,
  skill: number,
  augmented: number,
  opponent: number,
  result: number
): string {
  let actualSkill = calculateSkillByGrade(
    skill,
    augmented,
    opponent,
    difficultyGradeIndex
  );
  if (result <= getCrit(actualSkill, augmented))
    return getSuccessLevelIcons()[1];
  if (result <= getSuccess(actualSkill)) return getSuccessLevelIcons()[0];
  if (result >= getFumble(actualSkill, augmented)) return getSuccessLevelIcons()[2];
  return "close";
}

function getSuccessLevelIcons(): string[] {
  return ['check', 'gps_fixed', 'bolt'];
}
