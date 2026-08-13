export interface TeamMember {
  name: string;
  image: string;
  title: string;
  link?: string;
}

export const TEAM_DATA = {
  professor: [
    {
      name: "Hady W. Lauw",
      image: "/team/members/hady-lauw.png",
      title: "Associate Professor (SMU)",
      link: "http://www.hadylauw.com",
    },
  ],

  staff: [
    {
      name: "Do Dinh Hieu, Jaime",
      image: "/team/members/jaime-hieu.jpg",
      title: "Research Scientist (SMU)",
      link: "https://jaimehd.com/",
    },
  ],

  students: [
    {
      name: "Ezekiel Ong Young",
      image: "/team/members/ezekiel.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/ezekiel-young/",
    },
    {
      name: "Le Thi Phuong",
      image: "/team/members/phuong.jpeg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/phuonglt26/",
    },
    {
      name: "Lim Jia Peng",
      image: "/team/members/jiapeng.png",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/jia-peng-lim",
    },
    {
      name: "Nguyen Minh Quang",
      image: "/team/members/quang.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/mquang-nguyen/",
    },
    {
      name: "Ngo Huu Manh Khanh",
      image: "/team/members/khanh.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/manhkhanhnh/",
    },
    {
      name: "Nguyen Quoc Trung, Derrick",
      image: "/team/members/derrick.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/trung-nguyen-370993199/",
    },
    {
      name: "Huu-Loc Tran, Luke",
      image: "/team/members/luke.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://trhuuloc.github.io/",
    },
    {
      name: "Dilan Dinushka",
      image: "/team/members/dilan.jpeg",
      title: "PhD co-supervisee (SMU)",
      link: "https://www.linkedin.com/in/ddsdinushka",
    },
    {
      name: "Dong Viet Hoang, Eric",
      image: "/team/members/hoang.jpg",
      title: "PhD co-supervisee (SMU)",
      link: "https://hoangdv.me/",
    },
  ],

  alumni: [
    {
      name: "Aghiles Salah",
      image: "/team/members/ghiles.png",
      title: "Senior Research Scientist (Rakuten)",
      link: "http://saghiles.github.io/",
    },
    {
      name: "Chia Chong Cher",
      image: "/team/members/chongcher.png",
      title: "Senior Manager (Singapore Institute of Legal Education)",
      link: "https://www.linkedin.com/in/chongcher/",
    },
    {
      name: "Darryl Ong",
      image: "/team/members/darryl-ong.jpg",
      title: "Machine Learning Engineer (Hewlett Packard Enterprise)",
      link: "https://www.linkedin.com/in/ongrongsheng/",
    },
    {
      name: "Hongtuo Nie",
      image: "/team/members/hongtuonie.jpeg",
      title: "",
      link: "https://felixnie.github.io/",
    },
    {
      name: "Konstantinos Theocharidis",
      image: "/team/members/konstantinos.jpeg",
      title: "",
      link: "https://www.linkedin.com/in/konstantinos-theocharidis-36299159/",
    },
    {
      name: "Le Duc Trong, Tony",
      image: "/team/members/trong-le.jpg",
      title: "Lecturer (UET-VNU)",
      link: "https://sites.google.com/view/trongld",
    },
    {
      name: "Le Duy Dung, Andrew",
      image: "/team/members/andrew-le.jpg",
      title: "Assistant Professor (VinUni)",
      link: "https://andrew-dungle.github.io/",
    },
    {
      name: "Le Trung Hoang",
      image: "/team/members/hoang-le.png",
      title: "Lecturer (HCMUS-VNU)",
      link: "https://lthoang.com/",
    },
    {
      name: "Lee Ween Jiann",
      image: "/team/members/ween-jiann.jpg",
      title: "Assistant Principal AI Scientist (ST Engineering)",
      link: "https://www.linkedin.com/in/weenjiann/",
    },
    {
      name: "Maksim Tkachenko",
      image: "/team/members/maksim.png",
      title: "General Manager, AI Research (Rakuten)",
      link: "http://www.mtkachenko.info/",
    },
    {
      name: "Tran Nhu Thuat",
      image: "/team/members/thuat.jpg",
      title: "",
      link: "https://www.linkedin.com/in/nhu-thuat-tran-84b549161/",
    },
    {
      name: "Truong Quoc Tuan",
      image: "/team/members/tuan-truong.jpg",
      title: "Senior ML Engineer (Pinterest)",
      link: "https://qtuantruong.github.io/",
    },
    {
      name: "Zhang Ce",
      image: "/team/members/ce-zhang.png",
      title: "Lecturer (University of Sheffield)",
      link: "https://sites.google.com/view/delvincezhang",
    },
  ],
} as const;
