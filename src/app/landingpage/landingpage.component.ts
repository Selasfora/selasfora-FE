import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.less']
})

export class LandingpageComponent implements OnInit {
  public pages = [
    {
      //imagePath: '/assets/images/HeadingImage_hands2.jpg',
      imagePath: '/assets/images/02@2x.png',
      colorShade: 'dark',
      content: {
        title: 'Selasfora bracelet',
        subtext: 'The Limited-edition Paint-splattered Collection is created by set designer Tracy.',
        cta: 'Watch the film',
        btn: 'Create your own'
      }
    },
    {
      imagePath: '/assets/images/03@2x.png',
      colorShade: 'light',
      content: {
        title: 'Easy to customize',
        subtext: 'We wanted to capture the color of a summer night\'s sky',
        cta: 'Patent pending technology'
      }
    },
    {
      imagePath: '/assets/images/04@2x.png',
      colorShade: 'dark',
      content: {
        title: 'Easy to wear',
        subtext: 'We believe that great style begins with great design. Every single piece is conceived in our studio, where designers sketch, drape, tuck and bead a collection to life'
      }
    },
    {
      imagePath: '/assets/images/05@2x.png',
      colorShade: 'light',
      content: {
        title: 'Perfect for any occasion',
        subtext: 'Sophisticated and perfectly chunky, this is the kind of piece that adds a touch of effortless polish to just about any outfit.',
        btn: 'Get your bracelet'
      }
    },
    {
      imagePath: '/assets/images/06@2x.png',
      colorShade: 'light',
      content: {
        title: 'The magic is in the mix',
        subtext: 'We side with style over fashion, think timelessness is underrated and find that style look best when they’re lived in.',
        cta: 'Shop charms'
      }
    },
    {
      imagePath: '/assets/images/07@2x.png',
      colorShade: 'dark',
      content: {
        title: 'Stay in touch',
        subtext: 'Be the first to know about our new collection and other news',
        cta: 'Patent pending technology'
      }
    }
  ];

  constructor() {}

  ngOnInit() {
  }

}
