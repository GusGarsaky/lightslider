'use strict'
class Slider {
  constructor(el, url) {
    this.slider = el
    this.prevBtn = el.querySelector('.prevBtn')
    this.nextBtn = el.querySelector('.nextBtn')
    this.images = ['img/img1.jpg','img/img2.jpg','img/img3.jpg','img/img4.jpg','img/img5.jpg','img/img6.jpg','img/img7.jpg']
    this.current = 0
    this.url = this.slider.getAttribute('data-img-folder')
    this.init()
  }
  init() {
    this.prevBtn.addEventListener('click', function() {
      this.loadPrevImg()
    }.bind(this))
    this.nextBtn.addEventListener('click', function() {
      this.loadNextImg()
    }.bind(this))
    // this.loadImages() doesn't works with Github because CORS ajax request
  }
  setModeAuto(option) {
    let self = this;
    setInterval(function() {
      self.loadNextImg()
    }, 5000)
  }
  loadPrevImg() {
    let self = this
    this.current = (this.current > 0) ? this.current - 1 : this.images.length - 1
    let img = this.createImage('left')
    this.slider.appendChild(img)

    setTimeout(function() {
      img.style.left = '0%'
      // 600 = .6s of slide animation
      setTimeout(function() {
          self.removeBefore()
      }, 600)
    },30)
  }
  loadNextImg() {
    let self = this
    this.current = (this.current < this.images.length - 1) ? this.current + 1 : 0
    let img = this.createImage('right')
    this.slider.appendChild(img)

    setTimeout(function() {
      img.style.right = '0%'
      // 600 = .6s of slide animation
      setTimeout(function() {
        self.removeBefore()
      }, 600)
    }, 30)
  }
  loadImages() {
    let self = this;
    let imgUrls = [];
    let http = new XMLHttpRequest()
    http.open('GET', this.url, true)

    http.onload = function() {
      if(http.status === 200) {
        let html = document.createElement('html')
        html.innerHTML = this.response
        let links = html.querySelectorAll('a')
        for(let i=0; i<links.length; i++) {
          let content = (links[i].innerText).trim()
          if(self.isValidImg(content)) {
            //self.images.push(self.url+content)
            imgUrls.push(self.url+content) // yourfolderpath/imgx.jpg ...
          }
        }
      } else {
        console.log('error: '+http.response)
      }
    }
    http.send()
    createImagesBlob(imgUrls)
  }
  createImagesBlob(imgUrls) {
    let self = this;
    for(let i=0; i<imgUrls.length; i++) {
      let http = new XMLHttpRequest()
      http.responseType = 'blob'
      http.open('GET', imgUrls[i], true)
      http.onload = function() {
        if(this.status === 200) {
          self.images.push(window.URL.createObjectURL(this.response))
        }
      }
      http.send();
    } // end for
  }
  createImage(side) {
    let img = document.createElement('img')
    img.setAttribute('src', this.images[this.current])
    img.classList.add('img')
    if (side === 'right') {
      img.classList.add('right')
    } else {
      img.classList.add('left')
    }
    return img
  }
  removeBefore() {
    let child = this.slider.querySelector('img');
    this.slider.removeChild(child);
  }
  isValidImg(file) {
    let suffixes = ['.jpg', '.jpeg', '.png', '.gif']
    for(var i=0; i<suffixes.length; i++) {
        if(endsWith(file, suffixes[i])) {
          return true
        }
    }
    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    return false
  }
}
