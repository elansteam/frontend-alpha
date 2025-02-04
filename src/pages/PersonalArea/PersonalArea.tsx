// import MainContainer from "../../components/Container/MainContainer.tsx";
import {FC, useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Card, CardActionArea, CardActions,
    CardContent, CardHeader, IconButton,
    Stack,
    SxProps,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme
} from "@mui/material";
import {getCurrentUser, setTokens, UserType} from "../../api/auth.tsx";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from '@mui/icons-material/Settings';
import GroupsIcon from '@mui/icons-material/Groups';
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from "@mui/icons-material/MoreVertOutlined";
import {getCurrentGroups} from "../../api/api.tsx";


const GroupsContent: FC = () => {

    const [groups, setGroups] = useState<any>([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function setup() {
            setGroups( await getCurrentGroups());
        }
        setup();
    }, []);

    type Props = {
        name: string, description: string, members: number, domain: string,
        contests: number, _id: number
    };
    const GroupCard: FC<Props> = (props: Props) => {

        const handleAction = () => {
            navigate(`/Group/${props._id}`);
        }

        return <Card variant="elevation" sx={{width: "250px", display: "flex", flexDirection: "column"}}>
            <CardHeader
                avatar={<Avatar
                    sx={{background: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.primary.contrastText}}>
                    {props.name.substring(0, 2)}
                </Avatar>}
                action={
                    <IconButton color="inherit">
                        <MoreVertIcon/>
                    </IconButton>
                }
                // subheader="September 14, 2016"
            />
            <CardActionArea sx={{display: "flex", flexDirection: "column", flexGrow: "1", alignItems: "flex-start", justifyContent: "flex-start"}} onClick={handleAction}>
                <CardContent>
                    <Typography gutterBottom variant="h5" sx={{wrap: "normal"}}>
                        {props.name}
                    </Typography>
                    <Typography variant="body2" flexGrow="1">
                        {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Box sx={{display: "flex", alighItems: "flex-end"}}>
                    <Typography sx={{marginRight: "3px"}} fontWeight="bold">
                        {props.members}
                    </Typography>
                    <PeopleIcon/>
                </Box>
                <Box sx={{display: "flex"}}>
                    <Typography sx={{marginRight: "3px"}} fontWeight="bold">
                        {props.contests}
                    </Typography>
                    <EmojiEventsIcon color='primary'/>
                </Box>
            </CardActions>
        </Card>
    }


    const rootStyles: SxProps = {
        paddingLeft: "30px",
        paddingTop: "25px",
        width: "100%"
    }

    const stackStyles: SxProps = {
        display: "flex",
        overflow: "scroll",
    }

    let group_cards = [];
    for (let i = 0; i < groups.length; ++i) {
        let current_group_domain = groups[i].domain;
        if (current_group_domain === null) {
            current_group_domain = groups[i]._id
        }

        group_cards.push(
            <GroupCard key={i}
                       name={groups[i].name}
                       description={groups[i].description}
                       members={groups[i].members.length}
                       domain={current_group_domain}
                       contests={groups[i].contests.length}
                       _id={groups[i]._id}/>
        )
    }

    return <Box sx={rootStyles}>
        <Typography sx={{paddingBottom: "5px"}} variant="h2" fontWeight="bold">
            Your groups
        </Typography>
        <Box sx={stackStyles}>
            <Stack direction="row" spacing={2}>
                {group_cards} {/*FIXME FIXME FIXME here bug when a lot of groups*/}
            </Stack>
        </Box>
    </Box>
}

type Props = {
    user: any
}

const SettingsContent: FC<Props> = (props: Props) => {
    const navigate = useNavigate();

    const rootStyles: SxProps = {
        paddingLeft: "30px",
        paddingTop: "25px"
    }

    const handleLogout = () => {
        setTokens("", "");
        navigate("/auth/signin");
    }

    return <Box sx={rootStyles}>
        <Typography variant="h2" fontWeight="bold">
            Contact data
        </Typography>
        <Typography sx={{marginBottom: "10px"}} variant="h6">
            First name: {props.user?.first_name} <br/>
            Last name: {props.user?.last_name} <br/>
            Mid name: {props.user?.mid_name} <br/>
            email: {props.user?.email} <br/>

        </Typography>
        <Button variant="outlined" onClick={handleLogout}>Log out</Button>
    </Box>
}


const PersonalArea: FC = () => {

    const [user, setUser] = useState<UserType | undefined>();

    const theme = useTheme();

    useEffect(() => {
        async function temp() {
            setUser(await getCurrentUser());
        }


        temp();
    }, []);

    const rootStyles: SxProps = {
        borderRadius: "30px",
        backgroundColor: `${theme.palette.surfaceContainerLow.main};`,
        width: "100%",
        height: "100vh",
        display: "flex",
        position: "fixed",
    }

    const userStyles: SxProps = {
        paddingTop: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: `${theme.palette.onSurface.main}`,
        minWidth: "350px",
        marginLeft: "30px"
    }

    const navStyles: SxProps = {
        width: "100%",
        paddingLeft: "60px",
        paddingRight: "300px",
        flexGrow: "grow",
        flexDirection: "column",
        justifyContent: "center",
        display: "flex",
        height: "100%"
    }

    const avatarStyles = {
        width: "300px",
        height: "300px",
        marginBottom: "10px"
    }

    const navButtonsStyles: SxProps = {
        width: "100%",
        paddingBottom: "20px",
        paddingTop: "20px"
    }

    const dataStyles: SxProps = {
        backgroundColor: `${theme.palette.surfaceContainerLowest.main}`,
        borderRadius: "30px",
        height: "100%",
    }

    const [alignment, setAlignment] = useState<string>("groups");

    const [content, setContent] = useState<any>(<GroupsContent/>);
    // setContent(GroupsContent);

    const handleAlignment = (_event: React.MouseEvent<HTMLElement>,
                             newAlignment: string) => {
        if (newAlignment != null) {
            setAlignment(newAlignment);
            if (newAlignment == "groups") {
                setContent(<GroupsContent/>);
            } else if (newAlignment == "settings") {
                // @ts-ignore
                setContent(<SettingsContent user={user}/>);
            }
        }
    };


    return <>
        <Box sx={rootStyles}>
            <Box sx={userStyles}>
                <Avatar sx={avatarStyles}>
                    <Typography fontSize="400%">
                        {user?.first_name[0]}{user?.last_name[0]}
                    </Typography>
                </Avatar>
                <Box>
                    <Typography fontWeight="bold" variant="h4" sx={{color: `${theme.palette.onSurface.main}`}}>
                        {user?.first_name} {user?.last_name}
                    </Typography>
                    <Typography variant="h5" sx={{color: `${theme.palette.outline.main}`}}>
                        {user?.domain}
                    </Typography>
                </Box>
            </Box>
            <Box sx={navStyles}>
                <Box sx={navButtonsStyles}>
                    <Stack direction="row" spacing={2}>
                        <ToggleButtonGroup fullWidth={true} exclusive value={alignment} onChange={handleAlignment}>
                            <ToggleButton value="groups">
                                {alignment === 'groups' ? <CheckIcon sx={{mr: 1}}/> : <GroupsIcon sx={{mr: 1}}/>}
                                Groups
                            </ToggleButton>
                            <ToggleButton fullWidth={true} value="settings">
                                {alignment === 'settings' ? <CheckIcon sx={{mr: 1}}/> : <SettingsIcon sx={{mr: 1}}/>}
                                Settings
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Box>
                <Box sx={dataStyles}>
                    {content}
                </Box>
            </Box>
        </Box>
    </>
}


export default PersonalArea