import { Component, OnInit, Input ,EventEmitter,Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'toastr-ng2';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user.service';
declare var clevertap:any;

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less']
})
//selasfora-api-stg.herokuapp.com/documentation#/
export class AddressComponent implements OnInit {
  @Output('onRemoved') removeEvent = new EventEmitter<any>();
  @Output('onOpened') opened = new EventEmitter<any>();
  @Output('onClosed') closed = new EventEmitter<any>();
  countries = [ 
    {title: 'Afghanistan'}, 
    {title: 'Åland Islands'}, 
    {title: 'Albania'}, 
    {title: 'Algeria'}, 
    {title: 'American Samoa'}, 
    {title: 'AndorrA'}, 
    {title: 'Angola'}, 
    {title: 'Anguilla'}, 
    {title: 'Antarctica'}, 
    {title: 'Antigua and Barbuda'}, 
    {title: 'Argentina'}, 
    {title: 'Armenia'}, 
    {title: 'Aruba'}, 
    {title: 'Australia'}, 
    {title: 'Austria'}, 
    {title: 'Azerbaijan'}, 
    {title: 'Bahamas'}, 
    {title: 'Bahrain'}, 
    {title: 'Bangladesh'}, 
    {title: 'Barbados'}, 
    {title: 'Belarus'}, 
    {title: 'Belgium'}, 
    {title: 'Belize'}, 
    {title: 'Benin'}, 
    {title: 'Bermuda'}, 
    {title: 'Bhutan'}, 
    {title: 'Bolivia'}, 
    {title: 'Bosnia and Herzegovina'}, 
    {title: 'Botswana'}, 
    {title: 'Bouvet Island'}, 
    {title: 'Brazil'}, 
    {title: 'British Indian Ocean Territory'}, 
    {title: 'Brunei Darussalam'}, 
    {title: 'Bulgaria'}, 
    {title: 'Burkina Faso'}, 
    {title: 'Burundi'}, 
    {title: 'Cambodia'}, 
    {title: 'Cameroon'}, 
    {title: 'Canada'}, 
    {title: 'Cape Verde'}, 
    {title: 'Cayman Islands'}, 
    {title: 'Central African Republic'}, 
    {title: 'Chad'}, 
    {title: 'Chile'}, 
    {title: 'China'}, 
    {title: 'Christmas Island'}, 
    {title: 'Cocos (Keeling) Islands'}, 
    {title: 'Colombia'}, 
    {title: 'Comoros'}, 
    {title: 'Congo'}, 
    {title: 'Congo, The Democratic Republic of the'}, 
    {title: 'Cook Islands'}, 
    {title: 'Costa Rica'}, 
    {title: 'Cote D\'Ivoire'}, 
    {title: 'Croatia'}, 
    {title: 'Cuba'}, 
    {title: 'Cyprus'}, 
    {title: 'Czech Republic'}, 
    {title: 'Denmark'}, 
    {title: 'Djibouti'}, 
    {title: 'Dominica'}, 
    {title: 'Dominican Republic'}, 
    {title: 'Ecuador'}, 
    {title: 'Egypt'}, 
    {title: 'El Salvador'}, 
    {title: 'Equatorial Guinea'}, 
    {title: 'Eritrea'}, 
    {title: 'Estonia'}, 
    {title: 'Ethiopia'}, 
    {title: 'Falkland Islands (Malvinas)'}, 
    {title: 'Faroe Islands'}, 
    {title: 'Fiji'}, 
    {title: 'Finland'}, 
    {title: 'France'}, 
    {title: 'French Guiana'}, 
    {title: 'French Polynesia'}, 
    {title: 'French Southern Territories'}, 
    {title: 'Gabon'}, 
    {title: 'Gambia'}, 
    {title: 'Georgia'}, 
    {title: 'Germany'}, 
    {title: 'Ghana'}, 
    {title: 'Gibraltar'}, 
    {title: 'Greece'}, 
    {title: 'Greenland'}, 
    {title: 'Grenada'}, 
    {title: 'Guadeloupe'}, 
    {title: 'Guam'}, 
    {title: 'Guatemala'}, 
    {title: 'Guernsey'}, 
    {title: 'Guinea'}, 
    {title: 'Guinea-Bissau'}, 
    {title: 'Guyana'}, 
    {title: 'Haiti'}, 
    {title: 'Heard Island and Mcdonald Islands'}, 
    {title: 'Holy See (Vatican City State)'}, 
    {title: 'Honduras'}, 
    {title: 'Hong Kong'}, 
    {title: 'Hungary'}, 
    {title: 'Iceland'}, 
    {title: 'India'}, 
    {title: 'Indonesia'}, 
    {title: 'Iran, Islamic Republic Of'}, 
    {title: 'Iraq'}, 
    {title: 'Ireland'}, 
    {title: 'Isle of Man'}, 
    {title: 'Israel'}, 
    {title: 'Italy'}, 
    {title: 'Jamaica'}, 
    {title: 'Japan'}, 
    {title: 'Jersey'}, 
    {title: 'Jordan'}, 
    {title: 'Kazakhstan'}, 
    {title: 'Kenya'}, 
    {title: 'Kiribati'}, 
    {title: 'Korea, Democratic People\'S Republic of'}, 
    {title: 'Korea, Republic of'}, 
    {title: 'Kuwait'}, 
    {title: 'Kyrgyzstan'}, 
    {title: 'Lao People\'S Democratic Republic'}, 
    {title: 'Latvia'}, 
    {title: 'Lebanon'}, 
    {title: 'Lesotho'}, 
    {title: 'Liberia'}, 
    {title: 'Libyan Arab Jamahiriya'}, 
    {title: 'Liechtenstein'}, 
    {title: 'Lithuania'}, 
    {title: 'Luxembourg'}, 
    {title: 'Macao'}, 
    {title: 'Macedonia, The Former Yugoslav Republic of'}, 
    {title: 'Madagascar'}, 
    {title: 'Malawi'}, 
    {title: 'Malaysia'}, 
    {title: 'Maldives'}, 
    {title: 'Mali'}, 
    {title: 'Malta'}, 
    {title: 'Marshall Islands'}, 
    {title: 'Martinique'}, 
    {title: 'Mauritania'}, 
    {title: 'Mauritius'}, 
    {title: 'Mayotte'}, 
    {title: 'Mexico'}, 
    {title: 'Micronesia, Federated States of'}, 
    {title: 'Moldova, Republic of'}, 
    {title: 'Monaco'}, 
    {title: 'Mongolia'}, 
    {title: 'Montserrat'}, 
    {title: 'Morocco'}, 
    {title: 'Mozambique'}, 
    {title: 'Myanmar'}, 
    {title: 'Namibia'}, 
    {title: 'Nauru'}, 
    {title: 'Nepal'}, 
    {title: 'Netherlands'}, 
    {title: 'Netherlands Antilles'}, 
    {title: 'New Caledonia'}, 
    {title: 'New Zealand'}, 
    {title: 'Nicaragua'}, 
    {title: 'Niger'}, 
    {title: 'Nigeria'}, 
    {title: 'Niue'}, 
    {title: 'Norfolk Island'}, 
    {title: 'Northern Mariana Islands'}, 
    {title: 'Norway'}, 
    {title: 'Oman'}, 
    {title: 'Pakistan'}, 
    {title: 'Palau'}, 
    {title: 'Palestinian Territory, Occupied'}, 
    {title: 'Panama'}, 
    {title: 'Papua New Guinea'}, 
    {title: 'Paraguay'}, 
    {title: 'Peru'}, 
    {title: 'Philippines'}, 
    {title: 'Pitcairn'}, 
    {title: 'Poland'}, 
    {title: 'Portugal'}, 
    {title: 'Puerto Rico'}, 
    {title: 'Qatar'}, 
    {title: 'Reunion'}, 
    {title: 'Romania'}, 
    {title: 'Russian Federation'}, 
    {title: 'RWANDA'}, 
    {title: 'Saint Helena'}, 
    {title: 'Saint Kitts and Nevis'}, 
    {title: 'Saint Lucia'}, 
    {title: 'Saint Pierre and Miquelon'}, 
    {title: 'Saint Vincent and the Grenadines'}, 
    {title: 'Samoa'}, 
    {title: 'San Marino'}, 
    {title: 'Sao Tome and Principe'}, 
    {title: 'Saudi Arabia'}, 
    {title: 'Senegal'}, 
    {title: 'Serbia and Montenegro'}, 
    {title: 'Seychelles'}, 
    {title: 'Sierra Leone'}, 
    {title: 'Singapore'}, 
    {title: 'Slovakia'}, 
    {title: 'Slovenia'}, 
    {title: 'Solomon Islands'}, 
    {title: 'Somalia'}, 
    {title: 'South Africa'}, 
    {title: 'South Georgia and the South Sandwich Islands'}, 
    {title: 'Spain'}, 
    {title: 'Sri Lanka'}, 
    {title: 'Sudan'}, 
    {title: 'Suriname'}, 
    {title: 'Svalbard and Jan Mayen'}, 
    {title: 'Swaziland'}, 
    {title: 'Sweden'}, 
    {title: 'Switzerland'}, 
    {title: 'Syrian Arab Republic'}, 
    {title: 'Taiwan, Province of China'}, 
    {title: 'Tajikistan'}, 
    {title: 'Tanzania, United Republic of'}, 
    {title: 'Thailand'}, 
    {title: 'Timor-Leste'}, 
    {title: 'Togo'}, 
    {title: 'Tokelau'}, 
    {title: 'Tonga'}, 
    {title: 'Trinidad and Tobago'}, 
    {title: 'Tunisia'}, 
    {title: 'Turkey'}, 
    {title: 'Turkmenistan'}, 
    {title: 'Turks and Caicos Islands'}, 
    {title: 'Tuvalu'}, 
    {title: 'Uganda'}, 
    {title: 'Ukraine'}, 
    {title: 'United Arab Emirates'}, 
    {title: 'United Kingdom'}, 
    {title: 'United States'}, 
    {title: 'United States Minor Outlying Islands'}, 
    {title: 'Uruguay'}, 
    {title: 'Uzbekistan'}, 
    {title: 'Vanuatu'}, 
    {title: 'Venezuela'}, 
    {title: 'Viet Nam'}, 
    {title: 'Virgin Islands, British'}, 
    {title: 'Virgin Islands, U.S.'}, 
    {title: 'Wallis and Futuna'}, 
    {title: 'Western Sahara'}, 
    {title: 'Yemen'}, 
    {title: 'Zambia'}, 
    {title: 'Zimbabwe'} 
  ];

  addressForm: FormGroup;
  @Input() address: any = {};

  validationMessages = {
    'country': {
      'required': 'Country is required.',
    },
    'address': {
      'required': 'Last name is required.',
    },
    'city': {
      'required': 'City is required.'
    },
    'zip': {
      'required': 'Postal Code is required.'
    },
    dob: '',
    gender: ''
  };

  formErrors = {
    'country': ['required'],
    'address': ['required'],
    'city': ['required'],
    'zip': ['required']
  };

  errorMessage = '';

  editMode = false;
  addid = null;
  constructor(private fb: FormBuilder, private user: UserService,
    private auth: AuthService, private toaster: ToastrService) { }

  setCountry(c) {
    this.addressForm.get('country').setValue(c.title);
    console.log('country', c);
  }

  ngOnInit() {
   this.addid =  this.address ? this.address.id : null;
    this.addressForm = this.fb.group({
      country: [this.address.country, Validators.required],
      address1: [this.address.address1, Validators.required],
      address2: [this.address.address2],
      city: [this.address.city, Validators.required],
      zip: [this.address.zip, Validators.required],
      default: [this.address.default || false]
    });

    if(!this.addid) {
      this.opened.emit();
      this.editMode = true;
    }

  }

  edit() {
    this.editMode = true;
  }

  save() {
    this.user.saveAddress(this.addressForm.value,this.addid).subscribe(
      data => {
        this.editMode = false;
        console.log('success')
        this.closed.emit();
        // inform clever tap
        clevertap.event.push("user shipping address updated",this.addressForm.value)
      },
      err => {
        console.log('error')
        clevertap.event.push("user shipping address update failed",this.addressForm.value)
      }
    );
  }

  remove() {
    if(!this.addid){
      this.removeEvent.emit();
      this.closed.emit();
      return;
    }
    this.user.removeAddress(this.addid).subscribe(
      data => {
        this.removeEvent.emit();
        clevertap.event.push("user shipping address removed")
        console.log('success')
      },
      err => {
        clevertap.event.push("user shipping address remove failed")
        console.log('error')
      }
    );
  }

}
