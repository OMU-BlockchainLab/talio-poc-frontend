import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import { Box, Button, Chip, Divider, TextField, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import LayoutAdmin from 'layout/LayoutAdmin';
import * as React from 'react';
import { storage } from '../../firebase.config';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'urql';
import { CREATE_CV } from 'service/cv';
import { useNavigate } from 'react-router-dom';

let schema = yup.object().shape({
  describeLooking: yup.string().required('Required'),
  objective: yup.string().required('Required'),
  jobPosition: yup.string().required('Required'),
  numberOfYearsExperience: yup.number().required('Required'),
  minExpectedSalary: yup.number().required('Required'),
  maxExpectedSalary: yup.number().required('Required'),
});

export interface ICreateCVProps {}

interface DataForm {
  describeLooking: string;
  objective: string;
  jobPosition: string;
  numberOfYearsExperience: number;
  minExpectedSalary: number;
  maxExpectedSalary: number;
}

interface Skill {
  name: string;
  value: string;
}

type TypeFileCV = 'CV' | 'CERTIFICATE';

export default function CreateCV(props: ICreateCVProps) {
  const [fileCV, setFileCV] = React.useState<File>();
  const [itemCV, setItemCV] = React.useState<string>();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [progresspercent, setProgresspercent] = React.useState(0);
  const [certificaties, setCertificaties] = React.useState<File[]>([]);
  const [filesCerti, setFilesCerti] = React.useState<string[]>([]);
  const [listSkill, setListSkill] = React.useState<Skill[]>([]);
  const [{}, createCV] = useMutation(CREATE_CV);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
  });

  let filesUpdated: string[] = [];
  const handleUploadFirebase = async (file, type: TypeFileCV) => {
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (type === 'CV') {
            setItemCV(downloadURL);
          } else {
            filesUpdated = filesUpdated.concat(downloadURL);
            let newFiles = filesUpdated;
            setFilesCerti(newFiles);
          }
        });
      }
    );
  };

  const handleUploadItemCV = (e: any) => {
    setIsUploading(true);
    setFileCV(e.target.files[0]);
    e.preventDefault();
    handleUploadFirebase(e.target.files[0], 'CV');
    setIsUploading(false);
  };

  const handleUploadCertificate = (e: any) => {
    setCertificaties(e.target.files);
    e.preventDefault();
    setIsUploading(true);
    const files = e.target.files;
    for (const key of Object.keys(files)) {
      handleUploadFirebase(files[key], 'CERTIFICATE');
    }
    setIsUploading(false);
  };

  const handleAddRow = () => {
    if (listSkill.length < 10) {
      const newSkills = listSkill.concat({ name: `skill_${listSkill.length}`, value: '' });
      setListSkill(newSkills);
    }
  };

  const handleOnchangeSkill = (e, index) => {
    let clonedData = [...listSkill];
    const valueSkill = e.target.value;
    clonedData[index].value = valueSkill;
    setListSkill(clonedData);
  };

  const onSubmit: SubmitHandler<DataForm> = async (data) => {
    const skills = listSkill?.map((item) => item.value);
    const params = {
      ...data,
      cvUrl: itemCV,
      skills: skills?.toString() ?? '',
    };
    const createdCV = await createCV(params);
    if (createdCV.data?.createCV) {
      navigate('/');
    } else {
      alert('Create CV fail, please enter again!');
    }
  };

  return (
    <LayoutAdmin>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '950px',
          padding: '32px',
          background: '#FFFFFF',
          boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.05)',
          borderRadius: '20px',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 800,
            fontSize: '40px',
            lineHeight: '48px',
            color: '#4A4950',
            textAlign: 'left',
          }}
        >
          CREATE A NEW CV
        </Typography>
        <Divider sx={{ margin: '31px 0', width: '30%' }} />
        <form
          style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <ArticleIcon />
                <Typography marginLeft={'5px'}>Item CV</Typography>
              </Box>
              <Button variant="contained" component="label">
                Upload
                <input
                  accept="application/pdf"
                  id="contained-button-file"
                  multiple={false}
                  type="file"
                  onChange={handleUploadItemCV}
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>
            {itemCV && <Chip label={fileCV?.name} sx={{ width: 'fit-content' }} />}
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          {/* <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <ArticleIcon />
                <Typography marginLeft={'5px'}>Certificate</Typography>
              </Box>
              <Button variant="contained" component="label">
                Upload
                <input
                  accept="application/pdf"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleUploadCertificate}
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              {certificaties.length > 0 &&
                Object.keys(certificaties)?.map((key: any) => (
                  <Chip
                    label={certificaties[key].name}
                    sx={{ width: 'fit-content', marginLeft: '5px' }}
                  />
                ))}
            </Box>
          </Box> */}
          {/* <Divider sx={{ margin: '31px 0' }} /> */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              {...register('describeLooking')}
              name="describeLooking"
              error={!!errors.describeLooking}
              label="DESCRIBE WHAT YOU'RE LOOKING FOR"
              variant="outlined"
              id="outlined-basic"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              {...register('objective')}
              name="objective"
              error={!!errors.objective}
              id="outlined-basic"
              label="Industry Category"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              {...register('jobPosition')}
              name="jobPosition"
              error={!!errors.jobPosition}
              id="outlined-basic"
              label="Job Position"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              {...register('numberOfYearsExperience')}
              name="numberOfYearsExperience"
              error={!!errors.numberOfYearsExperience}
              id="outlined-basic"
              type={'number'}
              label="Year of experience"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              {...register('minExpectedSalary')}
              name="minExpectedSalary"
              error={!!errors.minExpectedSalary}
              id="outlined-basic"
              type={'number'}
              sx={{ width: '200px' }}
              label="Salary from"
              variant="outlined"
            />
            <span style={{ marginLeft: '10px', marginRight: '10px' }}>-</span>
            <TextField
              {...register('maxExpectedSalary')}
              name="maxExpectedSalary"
              error={!!errors.maxExpectedSalary}
              id="outlined-basic"
              sx={{ width: '200px' }}
              type={'number'}
              label="Salary to"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <ArticleIcon />
                <Typography marginLeft={'5px'}>Skills</Typography>
              </Box>
              <AddIcon onClick={handleAddRow} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {listSkill?.map((skill, index) => (
                <TextField
                  id="filled-basic"
                  name={skill.name}
                  value={skill.value}
                  onChange={(e) => handleOnchangeSkill(e, index)}
                  label="Skill"
                  variant="filled"
                  sx={{ marginBottom: '10px' }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Button type="submit" sx={{ width: '150px' }} variant="contained">
              Public CV
            </Button>
          </Box>
        </form>
      </Box>
    </LayoutAdmin>
  );
}
