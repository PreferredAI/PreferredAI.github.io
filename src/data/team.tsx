export interface TeamMember {
  name: string;
  image: string;
  url: string;
  title: string;
  link?: string;
}

export const TEAM_DATA = {
  professor: [
    {
      name: "Hady W. Lauw",
      image: "/uploads/2018/06/photo_hadylauw.png",
      url: "/team/hadylauw/",
      title: "Associate Professor (SMU)",
      link: "http://www.hadylauw.com",
    },
  ],

  staff: [
    {
      name: "Do Dinh Hieu",
      image: "/uploads/2020/08/photo_hieu2.jpg",
      url: "/team/hieu/",
      title: "Research Scientist (SMU)",
      link: "https://hieuddo.github.io/",
    },
  ],

  students: [
    {
      name: "Ezekiel Ong Young",
      image: "/uploads/2024/01/photo_ezekiel.jpg",
      url: "/team/ezekiel-ong-young/",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/ezekiel-young/",
    },
    {
      name: "Le Thi Phuong",
      image: "/uploads/2024/01/photo_phuong.jpg",
      url: "/team/le-thi-phuong/",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/phuonglt26/",
    },
    {
      name: "Lim Jia Peng",
      image: "/uploads/2020/12/photo_jiapeng.png",
      url: "/team/jiapeng/",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/jia-peng-lim",
    },
    {
      name: "Nguyen Minh Quang",
      image: "/uploads/2024/01/photo_quang.jpg",
      url: "/team/nguyen-minh-quang/",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/mquang-nguyen/",
    },
    {
      name: "Ngo Huu Manh Khanh",
      image: "",
      url: "",
      title: "PhD Candidate (SMU)",
      link: "",
    },
    {
      name: "Nguyen Quoc Trung, Derrick",
      image: "",
      url: "",
      title: "PhD Candidate (SMU)",
      link: "",
    },
    {
      name: "Dilan Dinushka",
      image: "/uploads/2023/05/photo_dilan.jpeg",
      url: "/team/dilan-dinushka/",
      title: "PhD co-supervisee (SMU)",
      link: "https://www.linkedin.com/in/ddsdinushka",
    },
    {
      name: "Dong Viet Hoang, Eric",
      image: "",
      url: "",
      title: "PhD co-supervisee (SMU)",
      link: "",
    },
  ],

  alumni: [
    {
      name: "Aghiles Salah",
      image: "/uploads/2018/04/ghiles.png",
      url: "/team/aghiles/",
      title: "Senior Research Scientist (Rakuten)",
      link: "http://saghiles.github.io/",
    },
    {
      name: "Chia Chong Cher",
      image: "/uploads/2018/06/headshot-square.png",
      url: "/team/chongcher/",
      title: "Senior Manager (Singapore Institute of Legal Education)",
      link: "https://www.linkedin.com/in/chongcher/",
    },
    {
      name: "Darryl Ong",
      image: "/uploads/2019/06/dp_400-1.jpg",
      url: "/team/darryl/",
      title: "Machine Learning Engineer (Hewlett Packard Enterprise)",
      link: "https://www.linkedin.com/in/ongrongsheng/",
    },
    {
      name: "Hongtuo Nie",
      image: "/uploads/2023/05/photo_hongtuonie.jpeg",
      url: "/team/hongtuo-nie/",
      title: "",
      link: "https://felixnie.github.io/",
    },
    {
      name: "Konstantinos Theocharidis",
      image: "/uploads/2023/05/photo_konstantinos.jpeg",
      url: "/team/konstantinos-theocharidis/",
      title: "",
      link: "https://www.linkedin.com/in/konstantinos-theocharidis-36299159/",
    },
    {
      name: "Le Duc Trong, Tony",
      image: "/uploads/2018/04/TrongLe_Avatar.jpg",
      url: "/team/trong/",
      title: "Lecturer (UET-VNU)",
      link: "https://sites.google.com/view/trongld",
    },
    {
      name: "Le Duy Dung, Andrew",
      image: "/uploads/2018/04/Andrew.jpg",
      url: "/team/andrew/",
      title: "Assistant Professor (VinUni)",
      link: "https://andrew-dungle.github.io/",
    },
    {
      name: "Le Trung Hoang",
      image: "/uploads/2018/06/hoangle_photo.png",
      url: "/team/hoang/",
      title: "Lecturer (HCMUS-VNU)",
      link: "https://lthoang.github.io/",
    },
    {
      name: "Lee Ween Jiann",
      image: "/uploads/2018/04/Potrait-2.jpg",
      url: "/team/ween/",
      title: "Assistant Principal AI Scientist (ST Engineering)",
      link: "https://www.linkedin.com/in/weenjiann/",
    },
    {
      name: "Maksim Tkachenko",
      image: "/uploads/2018/04/maksim2.png",
      url: "/team/maksim/",
      title: "General Manager, AI Research (Rakuten)",
      link: "http://www.mtkachenko.info/",
    },
    {
      name: "Tran Nhu Thuat",
      image: "/uploads/2020/08/photo_thuat2.jpg",
      url: "/team/thuat/",
      title: "",
      link: "https://www.linkedin.com/in/nhu-thuat-tran-84b549161/",
    },
    {
      name: "Truong Quoc Tuan",
      image: "/uploads/2018/04/photo_tuantruong.jpg",
      url: "/team/tuan/",
      title: "Senior ML Engineer (Pinterest)",
      link: "http://www.qttruong.com",
    },
    {
      name: "Zhang Ce",
      image: "/uploads/2018/10/张策的帅照.png",
      url: "/team/zhangce/",
      title: "Lecturer (University of Sheffield)",
      link: "https://sites.google.com/view/delvincezhang",
    },
  ],
} as const;
