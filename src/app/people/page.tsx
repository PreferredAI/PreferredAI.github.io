import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team - Preferred.AI",
  description: "Meet the Preferred.AI team and alumni",
};

interface TeamMember {
  name: string;
  image: string;
  url: string;
  title: string;
  link?: string;
}

const professor: TeamMember[] = [
  {
    name: "Hady W. Lauw",
    image: "/uploads/2018/06/photo_hadylauw.png",
    url: "/team/hadylauw/",
    title: "Associate Professor (SMU)",
    link: "http://www.hadylauw.com",
  },
];

const staff: TeamMember[] = [
  {
    name: "Do Dinh Hieu",
    image: "/uploads/2020/08/photo_hieu2.jpg",
    url: "/team/hieu/",
    title: "Research Scientist (SMU)",
    link: "https://hieuddo.github.io/",
  },
];

const studentsRaw: TeamMember[] = [
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
];

// Sort students: PhD Candidates first (alphabetically), then PhD co-supervisees (alphabetically)
const students = [...studentsRaw].sort((a, b) => {
  const isACand = a.title.includes("PhD Candidate");
  const isBCand = b.title.includes("PhD Candidate");

  // If both are same type, sort alphabetically by name
  if (isACand === isBCand) {
    return a.name.localeCompare(b.name);
  }

  // PhD Candidates come before co-supervisees
  return isACand ? -1 : 1;
});

const alumniRaw: TeamMember[] = [
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
];

// Sort alumni alphabetically by name
const alumni = [...alumniRaw].sort((a, b) => a.name.localeCompare(b.name));

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Link href={member.url} className="group mb-4 block">
        <div className="relative aspect-square w-48 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            sizes="192px"
          />
        </div>
      </Link>
      <h3 className="mb-1 text-lg font-semibold">
        <Link href={member.url} className="hover:text-[#b91c1c]">
          {member.name}
        </Link>
      </h3>
      {member.title && (
        <p className="mb-2 text-sm text-gray-600">
          <Link href={member.url} className="hover:text-[#b91c1c]">
            {member.title}
          </Link>
        </p>
      )}
      {member.link && (
        <a
          href={member.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#b91c1c] hover:underline"
        >
          {member.link}
        </a>
      )}
    </div>
  );
}

function TeamSection({ members }: { members: TeamMember[] }) {
  // Check if last row has only 1 person (odd number of members)
  const hasOddMember = members.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {members.map((member, index) => {
        const isLastAndOdd = hasOddMember && index === members.length - 1;
        return (
          <div
            key={member.name}
            className={
              isLastAndOdd ? "sm:col-span-2 sm:flex sm:justify-center" : ""
            }
          >
            <TeamMemberCard member={member} />
          </div>
        );
      })}
    </div>
  );
}

export default function PeoplePage() {
  return (
    <div>
      <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-wide text-gray-800">
        Meet the Team
      </h1>

      {/* Professor */}
      <div className="mb-12 flex justify-center">
        {professor.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>

      {/* Staff */}
      <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-gray-700">
        Research Staffs
      </h2>
      <div className="mb-12">
        <TeamSection members={staff} />
      </div>

      {/* Students */}
      <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-gray-700">
        Students
      </h2>
      <div className="mb-16">
        <TeamSection members={students} />
      </div>

      <hr className="my-12 border-t-2 border-gray-300" />

      <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-gray-800">
        Alumni
      </h2>

      <TeamSection members={alumni} />
    </div>
  );
}
