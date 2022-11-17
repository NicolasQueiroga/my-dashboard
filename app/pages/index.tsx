import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useForm } from "react-hook-form";
import { useState, useEffect, use } from "react";
import axios from "axios";
import SecurityGroups from "./security-groups/index"
import Instances from './instances/index';
import UserGroups from './user-groups/index';
import Users from './users/index';
import Resume from './resume/index';

const DEBUG = false;
const VARIABLES_ENDPOINT = "http://0.0.0.0:8000/api/aws/variables/";



export default function Home() {
  const [error, setError] = useState<Array<string> | null>(null);
  const { register, handleSubmit } = useForm();
  const [page, setPage] = useState<number>(DEBUG ? 3 : 0);

  const maxPage = 4;
  const [activeSg, setActiveSg] = useState<string>("");
  const [createNewSg, setCreateNewSg] = useState<boolean>(false);
  const [createNewInstance, setCreateNewInstance] = useState<boolean>(false);
  const [createNewUg, setCreateNewUg] = useState<boolean>(false);
  const [createNewUser, setCreateNewUser] = useState<boolean>(false);
  const [activeUg, setActiveUg] = useState<string>("");

  const actionsList = [
  ];
  const resourcesList = [
  ];

  const amiList = [
    "ami-08c40ec9ead489470",
    "ami-0149b2da6ceec4bb0",
    "ami-0ee23bfc74a881de5",
  ];
  const distroDict = {
    "ami-08c40ec9ead489470": "Ubuntu 22.04",
    "ami-0149b2da6ceec4bb0": "Ubuntu 20.04",
    "ami-0ee23bfc74a881de5": "Ubuntu 18.04",
  }


  const instanceTypeList = [
    "t2.micro",
    "t2.small",
    "t2.medium",
  ];

  const [availabilityZones, setAvailabilityZones] = useState<Array<string>>([
    "us-east-1a",
    "us-east-1b",
    "us-east-1c",
    "us-east-1d",
    "us-east-1e",
    "us-east-1f",
  ]);
  // useEffect(() => {
  //   async function loadOutput() {
  //     try {
  //       const response = await axios.get("/api/output");
  //       setAvailabilityZones(response.data.network.value.availability_zones);
  //     } catch (error) {
  //       setError(["Error loading terraform output"]);
  //     }
  //   }
  //   loadOutput();
  // }, []);

  const [json, setJson] = useState<JsonProps>(
    {
      "security_groups": [
        {
          "id": "1",
          "name": "security_group_1",
          "description": "security_group_1_description",
          "ingress": [
            {
              "protocol": "tcp",
              "from_port": "22",
              "to_port": "22",
              "cidr_blocks": [
                "0.0.0.0/0"
              ]
            }
          ]
        },
        {
          "id": "2",
          "name": "security_group_2",
          "description": "security_group_2_description",
          "ingress": [
            {
              "protocol": "tcp",
              "from_port": "22",
              "to_port": "22",
              "cidr_blocks": [
                "0.0.0.0/0"
              ]
            }
          ]
        }
      ],
      "user_groups": [
        {
          "id": "1",
          "name": "user_group_1",
          "description": "user_group_1_description",
          "restrictions": {
            "name": "user_group_1_restrictions",
            "description": "user_group_1_restrictions_description",
            "actions": [
              "*"
            ],
            "resources": [
              "*"
            ]
          }
        },
        {
          "id": "2",
          "name": "user_group_2",
          "description": "user_group_2_description",
          "restrictions": {
            "name": "user_group_2_restrictions",
            "description": "user_group_2_restrictions_description",
            "actions": [
              "*"
            ],
            "resources": [
              "*"
            ]
          }
        }
      ],
      "users": [
        {
          "id": "1",
          "groups_ids": ["1", "2"],
          "name": "user_teste_1",
          "restrictions": {
            "name": "user_teste_1_restrictions",
            "description": "user_teste_1_restrictions_description",
            "actions": [
              "*"
            ],
            "resources": [
              "*"
            ]
          }
        },
        {
          "id": "2",
          "groups_ids": ["2"],
          "name": "user_teste_2",
          "restrictions": {
            "name": "user_teste_2_restrictions",
            "description": "user_teste_2_restrictions_description",
            "actions": [
              "*"
            ],
            "resources": [
              "*"
            ]
          }
        }
      ],
      "instances": [
        {
          "name": "instance_1",
          "ami": "ami-0ee23bfc74a881de5",
          "instance_type": "t2.micro",
          "region": "us-east-1a",
          "security_groups_ids": [
            "1",
            "2"
          ]
        },
        {
          "name": "instance_2",
          "ami": "ami-0ee23bfc74a881de5",
          "instance_type": "t2.micro",
          "region": "us-east-1a",
          "security_groups_ids": [
            "2"
          ]
        }
      ]
    }
  );
  useEffect(() => {
    async function loadJson() {
      try {
        const response = await axios.get(VARIABLES_ENDPOINT);
        setJson(response.data);
      } catch (error) {
        setError(["Error loading json"]);
      }
    }
    loadJson();
  }, []);


  return (
    <div className={styles.container}>
      <Head>
        <title>My Dash</title>
        <meta name="My AWS dashboard" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}> My AWS dashboard </h1>
        <div className={styles.container}>
          {page === 0 && (<SecurityGroups json={json} setJson={setJson} page={page} setPage={setPage} />)}
          {page === 1 && (<Instances json={json} setJson={setJson} page={page} setPage={setPage} availabilityZones={availabilityZones} />)}
          {page === 2 && (<UserGroups json={json} setJson={setJson} page={page} setPage={setPage} />)}
          {page === 3 && (<Users json={json} setJson={setJson} page={page} setPage={setPage} />)}
          {page === 4 && (<Resume json={json} page={page} setPage={setPage} />)}
        </div>
        <div className={styles.map}>
          <button onClick={() => setPage(0)}>Security Groups</button>
          <button onClick={() => setPage(1)}>Instances</button>
          <button onClick={() => setPage(2)}>User Groups</button>
          <button onClick={() => setPage(3)}>Users</button>
          <button onClick={() => setPage(4)}>Resume</button>
        </div>
      </main >
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}
