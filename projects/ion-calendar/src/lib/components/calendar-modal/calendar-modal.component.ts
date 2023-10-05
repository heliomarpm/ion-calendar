import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
  OnInit,
  Input,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { NavParams, ModalController, IonContent } from '@ionic/angular';

import { IonCalendarService } from '../../ion-calendar.service';
import { ICalendarModalOptions, ICalendarDay, ICalendarMonth } from '../../models';
import { DateTimeHelper } from '../../helpers';
import { pickModes } from '../../types';

const NUM_OF_MONTHS_TO_CREATE = 3;

@Component({
  selector: 'ion-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss']
})
export class CalendarModalComponent implements OnInit, AfterViewInit {
  def!: ICalendarModalOptions;
  datesTemp: Array<ICalendarDay | null> = [null, null];
  calendarMonths!: Array<ICalendarMonth>;
  private step!: number;
  private showYearPicker!: boolean;
  private year!: number;
  private years!: Array<number>;
  private _scrollLock = true;
  private actualFirstTime!: number;

  @ViewChild(IonContent)
  private content!: IonContent;

  @ViewChild('months')
  private monthsEle!: ElementRef;

  @HostBinding('class.ion-page')
  private ionPage = true;

  @Input()
  private options!: ICalendarModalOptions;

  constructor(
    private _renderer: Renderer2,
    public _elementRef: ElementRef,
    public params: NavParams,
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public calSvc: IonCalendarService
  ) { }

  ngOnInit(): void {
    this.init();
    this.initDefaultDate();
  }

  ngAfterViewInit(): void {
    this.findCssClass();
    if (this.def.canBackwardsSelected) this.backwardsMonth();
    this.scrollToDefaultDate();
  }

  init(): void {
    this.def = this.calSvc.safeOpt(this.options);
    this.def.showAdjacentMonthDay = false;
    this.step = this.def.step || 0;
    if (this.step < this.calSvc.DEFAULT_STEP) {
      this.step = this.calSvc.DEFAULT_STEP;
    }

    this.calendarMonths = this.calSvc.createMonthsByPeriod(
      DateTimeHelper.parse(this.def.from).valueOf(),
      this.findInitMonthNumber(this.def.defaultScrollTo!) + this.step,
      this.def
    );
  }

  initDefaultDate(): void {
    const { pickMode, defaultDate, defaultDateRange, defaultDates } = this.def;
    switch (pickMode) {
      case pickModes.SINGLE:
        if (defaultDate) {
          this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDate), this.def);
        }
        break;
      case pickModes.RANGE:
        if (defaultDateRange) {
          if (defaultDateRange.from) {
            this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.from), this.def);
          }
          if (defaultDateRange.to) {
            this.datesTemp[1] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.to), this.def);
          }
        }
        break;
      case pickModes.MULTI:
        if (defaultDates && defaultDates.length) {
          this.datesTemp = defaultDates.map(e => this.calSvc.createCalendarDay(this._getDayTime(e), this.def));
        }
        break;
      default:
        this.datesTemp = [null, null];
    }
  }

  findCssClass(): void {
    const { cssClass } = this.def;
    if (cssClass) {
      cssClass.split(' ').forEach((_class: string) => {
        if (_class.trim() !== '') this._renderer.addClass(this._elementRef.nativeElement, _class);
      });
    }
  }

  onChange(data: any): void {
    const { pickMode, autoDone } = this.def;

    this.datesTemp = data;
    this.ref.detectChanges();

    if (pickMode !== pickModes.MULTI && autoDone && this.canDone()) {
      this.done();
    }

    this.repaintDOM();
  }

  onCancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  done(): void {
    const { pickMode } = this.def;

    this.modalCtrl.dismiss(this.calSvc.wrapResult(this.datesTemp as ICalendarDay[], pickMode!), 'done');
  }

  canDone(): boolean {
    if (!Array.isArray(this.datesTemp)) {
      return false;
    }
    const { pickMode } = this.def;

    switch (pickMode) {
      case pickModes.SINGLE:
        return !!(this.datesTemp[0] && this.datesTemp[0].time);
      case pickModes.RANGE:
        return !!(this.datesTemp[0] && this.datesTemp[1]) && !!(this.datesTemp[0].time && this.datesTemp[1].time);
      case pickModes.MULTI:
        return this.datesTemp.length > 0 && this.datesTemp.every(e => !!e && !!e.time);
      default:
        return false;
    }
  }

  clear() {
    this.datesTemp = [null, null];
  }

  canClear() {
    return !!this.datesTemp[0];
  }

  nextMonth(event: any): void {
    const len = this.calendarMonths.length;
    const final = this.calendarMonths[len - 1];
    // const nextTime = moment(final.original.time).add(1, 'M').valueOf();
    const nextTime = DateTimeHelper.parse(final.original.time).plus({ months: 1 }).valueOf();
    const rangeEnd = this.def.to ? DateTimeHelper.parse(this.def.to).minus({ months: 1 }) : 0;

    // if (len <= 0 || (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
    if (len <= 0 || (rangeEnd !== 0 && DateTimeHelper.parse(final.original.time) > rangeEnd)) {
      event.target.disabled = true;
      return;
    }

    this.calendarMonths.push(...this.calSvc.createMonthsByPeriod(nextTime, NUM_OF_MONTHS_TO_CREATE, this.def));
    event.target.complete();
    this.repaintDOM();
  }

  backwardsMonth(): void {
    const first = this.calendarMonths[0];

    if (first.original.time <= 0) {
      this.def.canBackwardsSelected = false;
      return;
    }

    const firstTime = (this.actualFirstTime = DateTimeHelper.parse(first.original.time)
      .minus({ months: NUM_OF_MONTHS_TO_CREATE })
      .valueOf());

    this.calendarMonths.unshift(...this.calSvc.createMonthsByPeriod(firstTime, NUM_OF_MONTHS_TO_CREATE, this.def));
    this.ref.detectChanges();
    this.repaintDOM();
  }

  scrollToDate(date: Date): void {
    const defaultDateIndex = this.findInitMonthNumber(date);
    const monthElement = this.monthsEle.nativeElement.children[`month-${defaultDateIndex}`];
    const domElemReadyWaitTime = 300;

    setTimeout(() => {
      const defaultDateMonth = monthElement ? monthElement.offsetTop : 0;

      if (defaultDateIndex !== -1 && defaultDateMonth !== 0) {
        this.content.scrollByPoint(0, defaultDateMonth, 128);
      }
    }, domElemReadyWaitTime);
  }

  scrollToDefaultDate(): void {
    this.scrollToDate(this.def.defaultScrollTo!);
  }

  onScroll($event: any): void {
    if (!this.def.canBackwardsSelected) return;

    const { detail } = $event;

    if (detail.scrollTop <= 200 && detail.velocityY < 0 && this._scrollLock) {
      this.content.getScrollElement().then(scrollElem => {
        this._scrollLock = !1;

        const heightBeforeMonthPrepend = scrollElem.scrollHeight;
        this.backwardsMonth();
        setTimeout(() => {
          const heightAfterMonthPrepend = scrollElem.scrollHeight;

          this.content.scrollByPoint(0, heightAfterMonthPrepend - heightBeforeMonthPrepend, 0).then(() => {
            this._scrollLock = !0;
          });
        }, 180);
      });
    }
  }

  /**
   * In some older Safari versions (observed at Mac's Safari 10.0), there is an issue where style updates to
   * shadowRoot descendants don't cause a browser repaint.
   * See for more details: https://github.com/Polymer/polymer/issues/4701
   */
  async repaintDOM() {
    const scrollElement = await this.content.getScrollElement();
    // Update scrollElem to ensure that height of the container changes as Months are appended/prepended
    scrollElement.style.zIndex = '2';
    scrollElement.style.zIndex = 'initial';
    // Update monthsEle to ensure selected state is reflected when tapping on a day
    this.monthsEle.nativeElement.style.zIndex = '2';
    this.monthsEle.nativeElement.style.zIndex = 'initial';
  }

  findInitMonthNumber(date: Date): number {
    let startDate = this.actualFirstTime ? DateTimeHelper.parse(this.actualFirstTime) : DateTimeHelper.parse(this.def.from);
    const defaultScrollTo = DateTimeHelper.parse(date);
    const isAfter: boolean = defaultScrollTo > startDate;
    if (!isAfter) return -1;

    if (this.showYearPicker) {
      startDate = DateTimeHelper.parse(new Date(this.year, 0, 1));
    }

    return defaultScrollTo.diff(startDate).months;
  }

  _getDayTime(date: any): number {
    // return moment(moment(date).format('YYYY-MM-DD')).valueOf();
    const dtFormat = DateTimeHelper.parse(date).toFormat('yyyy-MM-dd');
    return DateTimeHelper.parse(dtFormat).valueOf();
  }

  _monthFormat(date: any): string {
    // return moment(date).format(this.def.monthFormat?.replace(/y/g, 'Y'));
    const dtFormat = this.def.monthFormat?.replace(/Y/g, 'y') || 'MMM yyyy';
    return DateTimeHelper.parse(date).toFormat(dtFormat);
  }

  trackByIndex(index: number, momentDate: ICalendarMonth): number {
    return momentDate.original ? momentDate.original.time : index;
  }
}
