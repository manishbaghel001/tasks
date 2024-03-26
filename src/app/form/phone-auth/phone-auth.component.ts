import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-phone-auth',
  templateUrl: './phone-auth.component.html',
  styleUrls: ['./phone-auth.component.css']
})
export class PhoneAuthComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }


  phoneNumber: any;
  fullName: any;
  userName: any;
  verificationId: any;
  user: any;
  phoneCode: any = '+91';
  otpInput: boolean = false;
  phoneInputFlg: boolean = true;
  otpRecaptcha: boolean = false;
  updateInput: boolean = false;
  btnDis: boolean = true;

  @Output() otpEntered = new EventEmitter<string>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('digit1') digit1!: ElementRef<HTMLInputElement>;
  @ViewChild('digit2') digit2!: ElementRef<HTMLInputElement>;
  @ViewChild('digit3') digit3!: ElementRef<HTMLInputElement>;
  @ViewChild('digit4') digit4!: ElementRef<HTMLInputElement>;
  @ViewChild('digit5') digit5!: ElementRef<HTMLInputElement>;
  @ViewChild('digit6') digit6!: ElementRef<HTMLInputElement>;

  countdownTotalSeconds: number = 120
  countdownDisplay: string;
  showResendBtn: boolean = false;

  resendBtn() {
    this.countdownTotalSeconds = 120;
    this.showResendBtn = false;
  }

  startCountdown() {
    interval(1000).subscribe(() => {
      if (this.countdownTotalSeconds <= 0) {
        this.showResendBtn = true;
      } else {
        this.countdownTotalSeconds--;
        const minutes = Math.floor(this.countdownTotalSeconds / 60);
        const seconds = this.countdownTotalSeconds % 60;
        this.countdownDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    });
  }

  onInput(index: number, event: any) {
    const nextInput = this[`digit${index + 1}`];
    if (event.target.value.length === 1 && nextInput) {
      nextInput.nativeElement.focus();
    }

    const otp = this.getOTPValue();
    if (otp.length === 6) {
      this.onOTPEntered(otp);
    }
  }

  onInputPhone(event: any) {
    if (event.target.value.length === 10 && this.phoneCode != '') {
      this.otpRecaptcha = true;
      this.btnDis = false
    }
    else {
      this.btnDis = true
    }
  }

  private getOTPValue(): string {
    return [
      this.digit1.nativeElement.value,
      this.digit2.nativeElement.value,
      this.digit3.nativeElement.value,
      this.digit4.nativeElement.value,
      this.digit5.nativeElement.value,
      this.digit6.nativeElement.value,
    ].join('');
  }

  onOTPEntered(otp: string) {
    this.authService.verifyCode(this.verificationId, otp)
      .then(user => {
        this.user = user
        this.otpRecaptcha = false;
        this.btnDis = true;
        this.otpInput = false;
        this.phoneInputFlg = false;
        if (!this.user['displayName'] && this.user['displayName'] == null) {
          this.updateInput = true;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  closePopup() {
    this.closeModal.emit();
    this.otpRecaptcha = false;
    this.updateInput = false;
    this.btnDis = true;
    this.otpInput = false;
    this.phoneInputFlg = true;
  }

  sendOtp() {
    let phoneNo = this.phoneCode + this.phoneNumber;
    this.authService.sendVerificationCode(phoneNo)
      .then(verificationId => {
        this.otpRecaptcha = false;
        this.updateInput = false;
        this.btnDis = true;
        this.otpInput = true;
        this.phoneInputFlg = false;
        this.verificationId = verificationId;
        this.startCountdown();
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateData() {
    this.authService.updateInfo(this.user, this.userName, this.fullName)
    this.closePopup()
  }
}
