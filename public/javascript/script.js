// testimonial
let testimonialColletion = [
  {
    username: " Rajesh Kumar",
    designation: "CEO of ABC Painting Services",
    comment:
      "Xynapse Technologies has been instrumental in taking our business to new heights. Their digital marketing strategies have significantly increased our online visibility, leading to a boost in customer engagement and sales. We highly recommend their services.",
  },
  {
    username: "Neha Sharma",
    designation: "Owner of XYZ Painters",
    comment:
      "I am extremely satisfied with the web development services Xynapse Technologies provides. They created a stunning and user-friendly website for my painting business, which has greatly enhanced our online presence. Their team is highly professional and delivers exceptional results",
  },
  {
    username: "Ankit Patel",
    designation: " Marketing Manager at PaintPro India",
    comment:
      "The digital marketing expertise of Xynapse Technologies has helped us reach a wider audience and generate quality leads. Their team understands the nuances of the Indian market and has tailored their strategies accordingly. We have seen remarkable growth in our business thanks to their efforts",
  },
  {
    username: "Dimti Karlenkov",
    designation: "Developer, Xynapse Tech",
    comment:
      "tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    username: "Ferro Quereshi",
    designation: "Developer, Xynapse Tech",
    comment:
      "tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const testimonials = document.querySelector(".testimonials");
const scrollBtn = document.querySelectorAll(".scroll-dot");

let firstTestimonial = `
<div class="profile-section">
  <div class="image-div">
    <img src="./images/man.png" alt="" />
  </div>
  <div class="name-div">
    <p class="name-p">${testimonialColletion[0].username}</p>
    <p class="designa-p">${testimonialColletion[0].designation}</p>
  </div>
</div>

<div class="comment-section">
  <i class="bi bi-quote"></i>
  <p>
  ${testimonialColletion[0].comment}
  </p>
</div>
`;

const firstTestiimonialDiv = document.createElement("div");
firstTestiimonialDiv.className = "comments-container";
firstTestiimonialDiv.innerHTML = firstTestimonial;

testimonials.appendChild(firstTestiimonialDiv);

for (let i = 0; i < 5; i++) {
  scrollBtn[i].onclick = function () {
    let newTestimonial = `
        <div class="profile-section">
          <div class="image-div">
            <img src="./images/man.png" alt="" />
          </div>
          <div class="name-div">
            <p class="name-p">${testimonialColletion[i].username}</p>
            <p class="designa-p">${testimonialColletion[i].designation}</p>
          </div>
        </div>

        <div class="comment-section">
          <i class="bi bi-quote"></i>
          <p>
          ${testimonialColletion[i].comment}
          </p>
        </div>
      `;

    const div = document.createElement("div");
    div.className = "comments-container";
    div.innerHTML = newTestimonial;

    testimonials.replaceChild(div, testimonials.children[0]);
    for (let i = 0; i < 5; i++) {
      scrollBtn[i].classList.remove("active");
    }
    this.classList.add("active");
  };
}

// swiper

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    480: {
      slidesPerView: 2,
    },
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.5,
      spaceBetween: 0,
    },
  },
});
