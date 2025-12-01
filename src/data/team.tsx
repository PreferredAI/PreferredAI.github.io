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
      image: "/uploads/2018/06/photo_hadylauw.png",
      title: "Associate Professor (SMU)",
      link: "http://www.hadylauw.com",
    },
  ],

  staff: [
    {
      name: "Do Dinh Hieu",
      image: "/uploads/2025/12/hieu.jpg",
      title: "Research Scientist (SMU)",
      link: "https://hieuddo.github.io/",
    },
  ],

  students: [
    {
      name: "Ezekiel Ong Young",
      image: "/uploads/2024/01/photo_ezekiel.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/ezekiel-young/",
    },
    {
      name: "Le Thi Phuong",
      image: "/uploads/2024/01/photo_phuong.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/phuonglt26/",
    },
    {
      name: "Lim Jia Peng",
      image: "/uploads/2020/12/photo_jiapeng.png",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/jia-peng-lim",
    },
    {
      name: "Nguyen Minh Quang",
      image: "/uploads/2024/01/photo_quang.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/mquang-nguyen/",
    },
    {
      name: "Ngo Huu Manh Khanh",
      image: "/uploads/2025/12/khanh.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/manhkhanhnh/",
    },
    {
      name: "Nguyen Quoc Trung, Derrick",
      image: "/uploads/2025/12/derrick.jpg",
      title: "PhD Candidate (SMU)",
      link: "https://www.linkedin.com/in/trung-nguyen-370993199/",
    },
    {
      name: "Dilan Dinushka",
      image: "/uploads/2023/05/photo_dilan.jpeg",
      title: "PhD co-supervisee (SMU)",
      link: "https://www.linkedin.com/in/ddsdinushka",
    },
    {
      name: "Dong Viet Hoang, Eric",
      image: "/uploads/2025/12/hoang.jpg",
      title: "PhD co-supervisee (SMU)",
      link: "https://sites.google.com/view/hoangdv",
    },
  ],

  alumni: [
    {
      name: "Aghiles Salah",
      image: "/uploads/2018/04/ghiles.png",
      title: "Senior Research Scientist (Rakuten)",
      link: "http://saghiles.github.io/",
    },
    {
      name: "Chia Chong Cher",
      image: "/uploads/2018/06/headshot-square.png",
      title: "Senior Manager (Singapore Institute of Legal Education)",
      link: "https://www.linkedin.com/in/chongcher/",
    },
    {
      name: "Darryl Ong",
      image: "/uploads/2019/06/dp_400-1.jpg",
      title: "Machine Learning Engineer (Hewlett Packard Enterprise)",
      link: "https://www.linkedin.com/in/ongrongsheng/",
    },
    {
      name: "Hongtuo Nie",
      image: "/uploads/2023/05/photo_hongtuonie.jpeg",
      title: "",
      link: "https://felixnie.github.io/",
    },
    {
      name: "Konstantinos Theocharidis",
      image: "/uploads/2023/05/photo_konstantinos.jpeg",
      title: "",
      link: "https://www.linkedin.com/in/konstantinos-theocharidis-36299159/",
    },
    {
      name: "Le Duc Trong, Tony",
      image: "/uploads/2018/04/TrongLe_Avatar.jpg",
      title: "Lecturer (UET-VNU)",
      link: "https://sites.google.com/view/trongld",
    },
    {
      name: "Le Duy Dung, Andrew",
      image: "/uploads/2018/04/Andrew.jpg",
      title: "Assistant Professor (VinUni)",
      link: "https://andrew-dungle.github.io/",
    },
    {
      name: "Le Trung Hoang",
      image: "/uploads/2018/06/hoangle_photo.png",
      title: "Lecturer (HCMUS-VNU)",
      link: "https://lthoang.github.io/",
    },
    {
      name: "Lee Ween Jiann",
      image: "/uploads/2018/04/Potrait-2.jpg",
      title: "Assistant Principal AI Scientist (ST Engineering)",
      link: "https://www.linkedin.com/in/weenjiann/",
    },
    {
      name: "Maksim Tkachenko",
      image: "/uploads/2018/04/maksim2.png",
      title: "General Manager, AI Research (Rakuten)",
      link: "http://www.mtkachenko.info/",
    },
    {
      name: "Tran Nhu Thuat",
      image: "/uploads/2020/08/photo_thuat2.jpg",
      title: "",
      link: "https://www.linkedin.com/in/nhu-thuat-tran-84b549161/",
    },
    {
      name: "Truong Quoc Tuan",
      image: "/uploads/2018/04/photo_tuantruong.jpg",
      title: "Senior ML Engineer (Pinterest)",
      link: "http://www.qttruong.com",
    },
    {
      name: "Zhang Ce",
      image: "/uploads/2018/10/张策的帅照.png",
      title: "Lecturer (University of Sheffield)",
      link: "https://sites.google.com/view/delvincezhang",
    },
  ],
} as const;
