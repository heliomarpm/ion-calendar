import {
  Component, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnInit, Input, AfterViewInit
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
  datesTemp: Array<ICalendarDay | null> = [null];
  calendarMonths!: Array<ICalendarMonth>;

  private showYearPicker!: boolean;
  private year!: number;
  private _scrollLock = true;
  private actualFirstTime!: number;

  @ViewChild('ionContent')
  private content: ElementRef | undefined;

  @ViewChild('months')
  private monthElement!: ElementRef;

  // @HostBinding('class.ion-page')
  // private ionPage = true;

  @Input() options!: ICalendarModalOptions;

  constructor(
    private _renderer: Renderer2,
    public _elementRef: ElementRef,
    public params: NavParams,
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public calSvc: IonCalendarService
  ) {
    // console.log("CalendarModalComponent.constructor");
  }

  ngOnInit(): void {
    this.init();
    this.initDefaultDate();
  }

  ngAfterViewInit(): void {
    this.findCssClass();
    if (this.def.canBackwardsSelected) this.backwardsMonth();
    this.scrollToDefaultDate();
  }

  private init(): void {
    this.def = this.calSvc.safeOpt(this.options);
    this.def.showAdjacentMonthDay = false;

    const { from, to, defaultScrollTo } = this.def;

    let step = this.def.step || 0;

    if (DateTimeHelper.isDate(to)) {
      const dateTo = DateTimeHelper.parse(to).toJSDate();
      step = Math.max(step, this.findIndexMonthElement(dateTo));
    }

    const startTime = DateTimeHelper.parse(from).valueOf();
    const scrollTo = defaultScrollTo!;

    if (scrollTo.getTime() !== startTime) {
      step = Math.max(step, this.findIndexMonthElement(scrollTo));
    }

    step = Math.max(step, this.calSvc.DEFAULT_STEP);
    this.calendarMonths = this.calSvc.createMonthsByPeriod(startTime, step, this.def);
  }

  private initDefaultDate(): void {
    const { pickMode, defaultDate, defaultDateRange, defaultDates } = this.def;
    switch (pickMode) {
      case pickModes.single:
        if (defaultDate) {
          this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDate), this.def);
        }
        break;
      case pickModes.range:
        if (defaultDateRange) {
          if (defaultDateRange.from) {
            this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.from), this.def);
          }
          if (defaultDateRange.to) {
            this.datesTemp[1] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.to), this.def);
          }
        }
        break;
      case pickModes.multi:
        if (defaultDates?.length) {
          this.datesTemp = defaultDates.map(e => this.calSvc.createCalendarDay(this._getDayTime(e), this.def));
        }
        break;
      default:
        this.datesTemp = [null, null];
    }
  }

  private findCssClass(): void {
    const { cssClass } = this.def;
    if (cssClass) {
      cssClass.split(' ').forEach((_class: string) => {
        if (_class.trim() !== '') this._renderer.addClass(this._elementRef.nativeElement, _class);
      });
    }
  }

  protected onChange(data: ICalendarDay[]): void {
    const { pickMode, autoDone } = this.def;

    this.datesTemp = data;
    this.ref.detectChanges();

    if (pickMode !== pickModes.multi && autoDone && this.canDone()) {
      this.done();
    }

    this.repaintDOM();
  }

  cancel(): void {
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
      case pickModes.single:
        return !!this.datesTemp[0]?.time;
      case pickModes.range:
        return !!(this.datesTemp[0]?.time && this.datesTemp[1]?.time);
      case pickModes.multi:
        return this.datesTemp.length > 0 && this.datesTemp.every(e => !!e?.time);
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

    const nextTime = DateTimeHelper.parse(final.original.time).plus({ months: 1 }).valueOf();
    const rangeEnd = this.def.to ? DateTimeHelper.parse(this.def.to).minus({ months: 1 }) : 0;

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

  private scrollToDate(date: Date): void {
    const elIndex = this.findIndexMonthElement(date);
    const monthElement = this.monthElement.nativeElement.children[`month-${elIndex}`];

    setTimeout(() => {
      const scrollTo = monthElement ? monthElement.offsetTop : 0;

      if (scrollTo > 0)
        this.content?.nativeElement.scrollByPoint(0, scrollTo, 120);

    }, 350);

  }

  private scrollToDefaultDate(): void {
    this.scrollToDate(this.def.defaultScrollTo!);
  }

  onScroll($event: any): void {
    if (!this.def.canBackwardsSelected) return;

    const content: IonContent = $event.target;
    const { detail } = $event;

    if (detail.scrollTop <= 200 && detail.velocityY < 0 && this._scrollLock) {
      content.getScrollElement().then(scrollElem => {
        this._scrollLock = !1;

        const heightBeforeMonthPrepend = scrollElem.scrollHeight;
        this.backwardsMonth();
        setTimeout(() => {
          const heightAfterMonthPrepend = scrollElem.scrollHeight;

          content.scrollByPoint(0, heightAfterMonthPrepend - heightBeforeMonthPrepend, 0).then(() => {
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
    this.monthElement.nativeElement.style.zIndex = '2';
    this.monthElement.nativeElement.style.zIndex = 'initial';
  }

  private findIndexMonthElement(date: Date): number {
    let startDate = this.actualFirstTime ? DateTimeHelper.parse(this.actualFirstTime) : DateTimeHelper.parse(this.def.from);
    const defaultScrollTo = DateTimeHelper.parse(date);
    const isAfter: boolean = defaultScrollTo > startDate;

    if (!isAfter) return -1;

    if (this.showYearPicker) {
      startDate = DateTimeHelper.parse(new Date(this.year, 0, 1));
    }

    return Math.round(defaultScrollTo.diff(startDate, 'month').months);
  }

  _getDayTime(date: any): number {
    const dtFormat = DateTimeHelper.parse(date).toFormat('yyyy-MM-dd');
    return DateTimeHelper.parse(dtFormat).valueOf();
  }

  _monthTitle(date: any): string {
    const dtFormat = this.def.monthFormat?.replace(/Y/g, 'y') || 'MMM yyyy';
    return DateTimeHelper.parse(date).toFormat(dtFormat, { locale: this.def.locale?.locale });
  }

  trackByIndex(index: number, momentDate: ICalendarMonth): number {
    return momentDate.original ? momentDate.original.time : index;
  }
}
