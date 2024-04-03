import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { interval } from 'rxjs';
import firebase from '@firebase/app-compat'

@Component({
  selector: 'app-phone-auth',
  templateUrl: './phone-auth.component.html',
  styleUrls: ['./phone-auth.component.css']
})
export class PhoneAuthComponent implements AfterViewInit {
  constructor(private authService: AuthService) { }

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('phoneNumberRef') phoneNumberRef: ElementRef;
  @ViewChild('phoneNumberRef1') phoneNumberRef1: ElementRef;

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
  countdownTotalSeconds: number = 120
  countdownDisplay: string;
  showResendBtn: boolean = false;
  otpEntered: string;

  ngOnInit() {
    this.countdownTotalSeconds = 120
  }

  ngAfterViewInit() {
  }

  resendBtn() {
    this.countdownTotalSeconds = 120;
    this.otpRecaptcha = true
    this.sendOtp()
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

  onInput() {
    if (this.otpEntered.length === 6) {
      this.onOTPEntered(this.otpEntered);
    }
  }

  onInputPhone(event: any) {
    if (event.target.value.length === 10 && this.phoneCode != '') {
      this.btnDis = false
      this.otpRecaptcha = true
    }
    else {
      this.btnDis = true
    }
  }

  onOTPEntered(otpEntered: string) {
    this.authService.verifyCode(this.verificationId, otpEntered)
      .then(user => {
        this.user = user
        this.otpRecaptcha = false;
        this.btnDis = true;
        this.otpInput = false;
        this.phoneInputFlg = false;
        this.otpEntered = ''
        if (!this.user['displayName'] && this.user['displayName'] == null) {
          this.updateInput = true;
        }
      })
      .catch(error => {
        this.otpRecaptcha = false;
        this.updateInput = false;
        this.btnDis = true;
        this.otpInput = true;
        this.phoneInputFlg = false;
        this.otpEntered = ''
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
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    this.authService.sendVerificationCode(phoneNo, appVerifier)
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
        this.otpRecaptcha = false;
        this.updateInput = false;
        this.btnDis = false;
        this.otpInput = false;
        this.phoneInputFlg = true;
      });
  }

  updateData() {
    this.authService.updateInfo(this.user, this.userName, this.fullName)
    this.closePopup()
  }
}
