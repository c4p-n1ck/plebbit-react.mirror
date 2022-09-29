import {
  Box,
  Text,
  useColorModeValue,
  useColorMode,
  Flex,
  Input,
  Textarea,
  Image,
  Icon,
  Switch,
  Link,
  useDisclosure,
  useToast,
  UnorderedList,
  ListItem,
  InputGroup,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useAccountsActions, useResolvedAuthorAddress } from '@plebbit/plebbit-react-hooks';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { ProfileContext } from '../../store/profileContext';
import AddAvatar from './modal/addAvatar';
import ExportAccount from './modal/exportAccount';
import logger from '../../utils/logger';
import AddBlockProvide from './modal/addBlockProvider';
import Swal from 'sweetalert2';
import Layout from '../../components/layout';
import { useLocation } from 'react-router-dom';

const Settings = () => {
  const mainBg = useColorModeValue('lightBody', 'darkBody');
  const mainColor = useColorModeValue('lightText2', 'darkText1');
  const metaColor = useColorModeValue('metaTextLight', 'metaTextDark');
  const linkColor = useColorModeValue('lightLink', 'darkLink');
  const { colorMode } = useColorMode();
  const [bPLoading, setBpLoading] = useState(false);
  const [view, setView] = useState('profile');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isBlockOpen, onOpen: onBlockOpen, onClose: onBlockClose } = useDisclosure();
  const { profile, device, authorAvatarImageUrl } = useContext(ProfileContext);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const tabs = [
    { label: 'Account', link: 'account' },
    { label: 'Profile', link: 'profile' },
    { label: 'Plebbit Options', link: 'plebbitOptions' },
    { label: 'Safety & Privacy', link: 'privacy' },
    { label: 'Feed Settings', link: 'feed' },
    { label: 'Notifications', link: 'notifications' },
    { label: 'Chat & Messaging', link: 'messaging' },
  ];
  const [userProfile, setUserProfile] = useState(profile);
  const ref = useRef(null);
  const { setAccount, deleteAccount } = useAccountsActions();
  const toast = useToast();

  const resolvedAuthorAddress = useResolvedAuthorAddress(
    userProfile ? userProfile?.author?.address : ''
  );
  logger('resolvedAddress', resolvedAuthorAddress, 'trace');

  useEffect(() => {
    setUserProfile({ ...profile });
  }, [profile]);

  const handleConfirm = (warning, callback) => {
    Swal.fire({
      title: warning,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      icon: 'warning',
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await callback();
      }
    });
  };

  const handleDelete = async (val) => {
    await delete userProfile?.plebbitOptions?.blockchainProviders[val];
    try {
      await setAccount(userProfile);
      toast({
        title: `changes saved`,
        variant: 'left-accent',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Account update`,
        variant: 'left-update',
        description: error?.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleSave = async (data) => {
    try {
      setBpLoading(true);
      await setAccount({
        ...userProfile,
        plebbitOptions: {
          ...userProfile?.plebbitOptions,
          blockchainProviders: {
            ...userProfile?.plebbitOptions?.blockchainProviders,
            [data?.chainTicker]: {
              ...data,
            },
          },
        },
      });
      setBpLoading(false);
      onBlockClose();
      toast({
        title: `changes saved`,
        variant: 'left-accent',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      setBpLoading(false);
      toast({
        title: `Account update`,
        variant: 'left-update',
        description: error?.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    setLoader(true);
    try {
      await deleteAccount();
      toast({
        title: `Account deleted`,
        variant: 'left-accent',
        status: 'success',
        isClosable: true,
      });
      setTimeout(() => {
        setLoader(false);
      }, 500);
    } catch (error) {
      setLoader(false);
      toast({
        title: `Account not deleted`,
        variant: 'left-update',
        description: error?.message,
        status: 'error',
        isClosable: true,
      });
    }
  };
  const handleResetPlebbitOptions = async () => {
    setLoader(true);
    try {
      await setAccount({
        ...userProfile,
        plebbitOptions: window.DefaultPlebbitOptions,
      });
      toast({
        title: `Account updated`,
        variant: 'left-accent',
        status: 'success',
        isClosable: true,
      });
      setTimeout(() => {
        setLoader(false);
      }, 500);
    } catch (error) {
      setLoader(false);
      toast({
        title: `Account not updated`,
        variant: 'left-update',
        description: error?.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Layout name={{ label: 'User Settings', value: location?.pathname }}>
      <Box
        paddingBottom="40px"
        marginLeft={device !== 'mobile' ? 'calc(100vw - 100%)' : ''}
        background={mainBg}
      >
        {loader && (
          <Flex
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
            zIndex="9999"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        )}
        {isOpen ? <AddAvatar isOpen={isOpen} onClose={onClose} /> : ''}
        {isExportOpen ? <ExportAccount isOpen={isExportOpen} onClose={onExportClose} /> : ''}
        {isBlockOpen ? (
          <AddBlockProvide
            isOpen={isBlockOpen}
            onClose={onBlockClose}
            handleSave={handleSave}
            loading={bPLoading}
          />
        ) : (
          ''
        )}
        <Box boxSizing="border-box" background={mainBg} position="relative">
          <Text
            maxW="1200px"
            fontSize="18px"
            fontWeight="500"
            lineHeight="22px"
            padding="16px 20px 20px"
            margin="0 auto"
            color={mainColor}
            fill="#fff"
          >
            User Settings
          </Text>
          <Flex
            maxW="1200px"
            background={mainBg}
            margin="0 auto"
            padding="0 20px"
            borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
            alignItems="center"
            color={metaColor}
            overflowX="scroll"
          >
            {tabs
              ? tabs.map((tab, index) => (
                  <Box
                    key={index}
                    fontSize="14px"
                    fontWeight="700"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    lineHeight="unset"
                    marginRight="8px"
                    padding="15px 12px 12px"
                    cursor="pointer"
                    borderBottom={
                      tab.link === view &&
                      `3px solid ${colorMode === 'light' ? '#343456' : '#d7d7dc'}`
                    }
                    color={view === tab?.link && mainColor}
                    _hover={{
                      color: mainColor,
                    }}
                    onClick={() => setView(tab?.link)}
                  >
                    {tab?.label}
                  </Box>
                ))
              : ''}
          </Flex>
        </Box>
        {view === 'account' && (
          <Flex maxW="1200px" margin="0 auto" padding="0 16px">
            <Box maxW="688px" flex="1 1 auto">
              <Text fontSize="20px" fontWeight="500" lineHeight="24px" padding="40px 0">
                Account settings
              </Text>

              <Text
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.5px"
                marginBottom="32px"
                paddingBottom="6px"
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                color={metaColor}
              >
                ACCOUNT PREFERENCES
              </Text>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    Account name (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    Set an account name.
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Input
                    placeholder="Accouny name (optional)"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="8px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="12px 24px 4px 12px"
                    width="100%"
                    value={userProfile?.name}
                    maxLength={30}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        name: e.target.value,
                      })
                    }
                    onBlur={() =>
                      setTimeout(async () => {
                        if (userProfile?.name !== profile?.name) {
                          try {
                            const res = await setAccount(userProfile);
                            logger('account:update', res);
                            toast({
                              title: `changes saved`,
                              variant: 'left-accent',
                              status: 'success',
                              isClosable: true,
                            });
                          } catch (error) {
                            logger('update-account', error, 'error');
                            toast({
                              title: `Account update`,
                              description: error?.message,
                              variant: 'left-accent',
                              status: 'error',
                              isClosable: true,
                            });
                          }
                        }
                      }, 300)
                    }
                    name="accountName"
                    ref={ref}
                  />
                  <Text
                    fontWeight="400"
                    color={metaColor}
                    fontSize="12px"
                    lineHeight="16px"
                    paddingTop="5px"
                  >
                    {30 - +userProfile?.name?.length} Characters remaining
                  </Text>
                </Flex>
              </Flex>

              <Text
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                fontSize="10px"
                fontWeight="700"
                lineHeight="12px"
                paddingBottom="6px"
                marginBottom="32px"
              >
                DELETE ACCOUNT
              </Text>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex
                  alignItems="center"
                  justifyContent="flex-end"
                  fontSize="14px"
                  fontWeight="700"
                  lineHeight="16.91px"
                  color="red"
                  cursor="pointer"
                  onClick={() =>
                    handleConfirm('Do you want to delete this Account?', handleDeleteAccount)
                  }
                >
                  <Icon as={RiDeleteBinLine} mr="5px" />
                  <Box>DELETE ACCOUNT</Box>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        )}
        {view === 'profile' && (
          <Flex maxW="1200px" margin="0 auto" padding="0 16px">
            <Box maxW="688px" flex="1 1 auto">
              <Text fontSize="20px" fontWeight="500" lineHeight="24px" padding="40px 0">
                Customize profile
              </Text>
              <Box marginBottom="25px">
                <Button onClick={onExportOpen}>Export Account</Button>
              </Box>
              <Text
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.5px"
                marginBottom="32px"
                paddingBottom="6px"
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                color={metaColor}
              >
                PROFILE INFORMATION
              </Text>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    Display name (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    Set a display name. This does not change your username.
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Input
                    placeholder="Display name (optional)"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="8px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="12px 24px 4px 12px"
                    width="100%"
                    value={userProfile?.author?.displayName || ''}
                    maxLength={30}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        author: {
                          ...userProfile?.author,
                          displayName: e.target.value,
                        },
                      })
                    }
                    onBlur={() =>
                      setTimeout(async () => {
                        if (userProfile?.author?.displayName !== profile?.author?.displayName) {
                          try {
                            const res = await setAccount(userProfile);
                            logger('account:update', res);
                            toast({
                              title: `changes saved`,
                              variant: 'left-accent',
                              status: 'success',
                              isClosable: true,
                            });
                          } catch (error) {
                            logger('update-account', error, 'error');
                            toast({
                              title: `Account update`,
                              description: error?.message,
                              variant: 'left-accent',
                              status: 'error',
                              isClosable: true,
                            });
                          }
                        }
                      }, 300)
                    }
                    name="displayName"
                    ref={ref}
                  />
                  <Text
                    fontWeight="400"
                    color={metaColor}
                    fontSize="12px"
                    lineHeight="16px"
                    paddingTop="5px"
                  >
                    {30 - +userProfile?.author?.displayName?.length} Characters remaining
                  </Text>
                </Flex>
              </Flex>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    Address
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    Set an Address for your profile..
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <InputGroup>
                    <Input
                      placeholder="Input public key (optional)"
                      backgroundColor={mainBg}
                      color={mainColor}
                      boxSizing="border-box"
                      marginBottom="8px"
                      border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                      borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                      height="48px"
                      borderRadius="4px"
                      padding="12px 24px 4px 12px"
                      width="100%"
                      value={userProfile?.author?.address || ''}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          author: {
                            ...userProfile?.author,
                            address: e.target.value,
                          },
                        })
                      }
                      onBlur={() =>
                        setTimeout(async () => {
                          if (userProfile?.author?.address !== profile?.author?.address) {
                            try {
                              const res = await setAccount(userProfile);
                              logger('account:update', res);

                              toast({
                                title: `changes saved`,
                                variant: 'left-accent',
                                status: 'success',
                                isClosable: true,
                              });
                            } catch (error) {
                              logger('update-account', error, 'error');
                              toast({
                                title: `Account update`,
                                variant: 'left-update',
                                description: error?.message,
                                status: 'error',
                                isClosable: true,
                              });
                            }
                          }
                        }, 300)
                      }
                      name="address"
                      ref={ref}
                    />
                  </InputGroup>

                  {resolvedAuthorAddress !== userProfile?.signer?.address ? (
                    <Text
                      fontWeight="400"
                      color="red"
                      fontSize="12px"
                      lineHeight="16px"
                      paddingTop="5px"
                    >
                      {userProfile?.author?.address} has not been acquired by you yet !!!
                    </Text>
                  ) : (
                    <Text
                      fontWeight="400"
                      color="green"
                      fontSize="12px"
                      lineHeight="16px"
                      paddingTop="5px"
                    >
                      your ens is set correctly
                    </Text>
                  )}
                  <UnorderedList mt={3}>
                    <ListItem fontSize={12}>
                      Go to{' '}
                      <Link
                        color={linkColor}
                        href={`https://app.ens.domains/name/${userProfile?.author?.address}`}
                        isExternal
                      >
                        {' '}
                        https://app.ens.domains/name/
                        {userProfile?.author?.address}{' '}
                      </Link>
                    </ListItem>
                    <ListItem fontSize={12}>Click ADD/EDIT RECORD</ListItem>
                    <ListItem fontSize={12}>
                      Select "text", write in "key": "plebbit-author-address", write in next field:{' '}
                      <b>{userProfile?.signer?.address}</b>
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    About (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    A brief description of yourself shown on your profile.
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Textarea
                    placeholder="About (optional)"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="0px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="8px"
                    width="100%"
                    resize="both"
                    value={userProfile?.author?.about || ''}
                    maxLength={200}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        author: {
                          ...userProfile?.author,
                          about: e.target.value,
                        },
                      })
                    }
                    onBlur={() =>
                      setTimeout(async () => {
                        if (userProfile?.author?.about !== profile?.author?.about) {
                          try {
                            const res = await setAccount(userProfile);
                            logger('account:update', res);
                            toast({
                              title: `changes saved`,
                              variant: 'left-accent',
                              status: 'success',
                              isClosable: true,
                            });
                          } catch (error) {
                            logger('update-account', error, 'error');
                            toast({
                              title: `Account update`,
                              variant: 'left-update',
                              description: error?.message,
                              status: 'error',
                              isClosable: true,
                            });
                          }
                        }
                      }, 300)
                    }
                    name="about"
                  />
                  <Flex width="100%">
                    <Text
                      fontWeight="400"
                      color={metaColor}
                      fontSize="12px"
                      lineHeight="16px"
                      paddingTop="5px"
                    >
                      {200 - (+userProfile?.author?.about?.length || 0)} Characters remaining
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Text
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                fontSize="10px"
                fontWeight="700"
                lineHeight="12px"
                paddingBottom="6px"
                marginBottom="32px"
              >
                Images
              </Text>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    Avatar image
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    nft
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDirection="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Flex height="150px" width="100%">
                    <Box
                      borderRadius="8px"
                      overflow="hidden"
                      height="100%"
                      margin="0 12px 0 0"
                      position="relative"
                      width="150px"
                      cursor="pointer"
                      onClick={onOpen}
                    >
                      <Box
                        backgroundColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                        width="100%"
                        height="100%"
                        borderRadius="50%"
                      />
                      <Image
                        fallbackSrc={require('../../assets/images/fallback.png')}
                        position="absolute"
                        top="0"
                        transformOrigin="bottom center"
                        clipPath="polygon(0 68.22%,12.12% 68.22%,12.85% 71.49%,13.86% 74.69%,15.14% 77.79%,16.69% 80.77%,18.49% 83.6%,20.54% 86.26%,22.8% 88.73%,25.28% 91%,27.94% 93.04%,30.77% 94.85%,33.75% 96.4%,36.85% 97.68%,40.05% 98.69%,43.32% 99.42%,46.65% 99.85%,50% 100%,53.35% 99.85%,56.68% 99.42%,59.95% 98.69%,63.15% 97.68%,66.25% 96.4%,69.23% 94.85%,72.06% 93.04%,74.72% 91%,77.2% 88.73%,79.46% 86.26%,81.51% 83.6%,83.31% 80.77%,84.86% 77.79%,86.14% 74.69%,87.15% 71.49%,87.88% 68.22%,100% 68.22%,100% 0,0 0)"
                        src={authorAvatarImageUrl}
                        onClick={onOpen}
                      />
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
              <Text
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                fontSize="10px"
                fontWeight="700"
                lineHeight="12px"
                paddingBottom="6px"
                marginBottom="32px"
              >
                PROFILE CATEGORY
              </Text>
              <Flex flexFlow="row wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px" maxWidth="80%">
                  <Box>
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      lineHeight="20px"
                      color={mainColor}
                      marginBottom="4px"
                    >
                      NSFW
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                      This content is NSFW (may contain nudity, pornography, profanity or
                      inappropriate content for those under 18)
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center" flexGrow="1" justifyContent="flex-end">
                  <Switch />
                </Flex>
              </Flex>
              <Text
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                fontSize="10px"
                fontWeight="700"
                lineHeight="12px"
                paddingBottom="6px"
                marginBottom="32px"
              >
                ADVANCED
              </Text>
              <Flex flexFlow="row wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px" maxWidth="80%">
                  <Box>
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      lineHeight="20px"
                      color={mainColor}
                      marginBottom="4px"
                    >
                      Allow people to follow you
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                      Followers will be notified about posts you make to your profile and see them
                      in their home feed.
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center" flexGrow="1" justifyContent="flex-end">
                  <Switch />
                </Flex>
              </Flex>
              <Flex flexFlow="row wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px" maxWidth="80%">
                  <Box>
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      lineHeight="20px"
                      color={mainColor}
                      marginBottom="4px"
                    >
                      Content visibility
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                      Posts to this profile can appear in p/all and your profile can be discovered
                      in /users
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center" flexGrow="1" justifyContent="flex-end">
                  <Switch />
                </Flex>
              </Flex>
              <Flex flexFlow="row wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px" maxWidth="80%">
                  <Box>
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      lineHeight="20px"
                      color={mainColor}
                      marginBottom="4px"
                    >
                      Active in communities visibility
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                      Show which communities I am active in on my profile.
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center" flexGrow="1" justifyContent="flex-end">
                  <Switch />
                </Flex>
              </Flex>
              <Text
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                fontSize="10px"
                fontWeight="700"
                lineHeight="12px"
                paddingBottom="6px"
                marginBottom="32px"
              >
                PROFILE MODERATION
              </Text>
              <Box>
                For moderation tools please visit our <br />
                <Link color={linkColor}>Profile Moderation page</Link>
              </Box>
            </Box>
          </Flex>
        )}
        {view === 'plebbitOptions' && (
          <Flex maxW="1200px" margin="0 auto" padding="0 16px">
            <Box maxW="688px" flex="1 1 auto">
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize="20px" fontWeight="500" lineHeight="24px" padding="40px 0">
                  Customize plebbit Options
                </Text>
                <Button
                  onClick={() =>
                    handleConfirm(
                      'Do you want to reset Plebbit Options?',
                      handleResetPlebbitOptions
                    )
                  }
                  variant="outline"
                  colorScheme="red"
                >
                  reset
                </Button>
              </Flex>
              <Text
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.5px"
                marginBottom="32px"
                paddingBottom="6px"
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                color={metaColor}
              >
                PLEBBIT OPTIONS
              </Text>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    IPFS Gateway Url (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    Optional URL of an IPFS gateway
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Input
                    placeholder="ipfs Gateway Url"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="8px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="12px 24px 4px 12px"
                    width="100%"
                    value={userProfile?.plebbitOptions?.ipfsGatewayUrl}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        plebbitOptions: {
                          ...userProfile?.plebbitOptions,
                          ipfsGatewayUrl: e.target.value,
                        },
                      })
                    }
                    ref={ref}
                    onBlur={() =>
                      setTimeout(async () => {
                        if (
                          userProfile?.plebbitOptions?.ipfsGatewayUrl !==
                          profile?.plebbitOptions?.ipfsGatewayUrl
                        ) {
                          try {
                            await setAccount(userProfile);
                            toast({
                              title: `changes saved`,
                              variant: 'left-accent',
                              status: 'success',
                              isClosable: true,
                            });
                          } catch (error) {
                            toast({
                              title: `Account update`,
                              variant: 'left-update',
                              description: error?.message,
                              status: 'error',
                              isClosable: true,
                            });
                          }
                        }
                      }, 300)
                    }
                    name="ipfsGatewayUrl"
                  />
                </Flex>
              </Flex>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    IPFS Http Client Options (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    Optional URL of an IPFS API or IpfsHttpClientOptions,{' '}
                    <strong
                      style={{
                        color: 'blue',
                      }}
                    >
                      http://localhost:5001
                    </strong>{' '}
                    to use a local IPFS node
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Input
                    placeholder=" ipfsHttpClientOptions (optional)"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="8px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="12px 24px 4px 12px"
                    width="100%"
                    value={userProfile?.plebbitOptions?.ipfsHttpClientOptions}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        plebbitOptions: {
                          ...userProfile?.plebbitOptions,
                          ipfsHttpClientOptions: e.target.value,
                        },
                      })
                    }
                    ref={ref}
                    onBlur={() =>
                      setTimeout(async () => {
                        if (
                          userProfile?.plebbitOptions?.ipfsHttpClientOptions !==
                          profile?.plebbitOptions?.ipfsHttpClientOptions
                        ) {
                          try {
                            await setAccount(userProfile);
                            toast({
                              title: `changes saved`,
                              variant: 'left-accent',
                              status: 'success',
                              isClosable: true,
                            });
                          } catch (error) {
                            toast({
                              title: `Account update`,
                              variant: 'left-update',
                              description: error?.message,
                              status: 'error',
                              isClosable: true,
                            });
                          }
                        }
                      }, 300)
                    }
                    name="ipfsHttpClientOptions"
                  />
                </Flex>
              </Flex>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    Pubsub Http Client Options (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    Optional URL or IpfsHttpClientOptions used for pubsub publishing when
                    ipfsHttpClientOptions isn't available, like in the browser
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Input
                    placeholder=" pubsubHttpClientOptions (optional)"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="8px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="12px 24px 4px 12px"
                    width="100%"
                    value={userProfile?.plebbitOptions?.pubsubHttpClientOptions}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        plebbitOptions: {
                          ...userProfile?.plebbitOptions,
                          pubsubHttpClientOptions: e.target.value,
                        },
                      })
                    }
                    ref={ref}
                    onBlur={() =>
                      setTimeout(async () => {
                        if (
                          userProfile?.plebbitOptions?.pubsubHttpClientOptions !==
                          profile?.plebbitOptions?.pubsubHttpClientOptions
                        ) {
                          try {
                            const res = await setAccount(userProfile);
                            logger('account:update', res);
                            toast({
                              title: `changes saved`,
                              variant: 'left-accent',
                              status: 'success',
                              isClosable: true,
                            });
                          } catch (error) {
                            logger('update-account', error, 'error');
                            toast({
                              title: `Account update`,
                              variant: 'left-update',
                              description: error?.message,
                              status: 'error',
                              isClosable: true,
                            });
                          }
                        }
                      }, 300)
                    }
                    name="pubsubHttpClientOptions"
                  />
                </Flex>
              </Flex>
              <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                <Flex flexDir="column" marginRight="8px">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="20px"
                    color={mainColor}
                    marginBottom="4px"
                  >
                    Data Path (optional)
                  </Text>
                  <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                    (Node only) Optional folder path to create/resume the user and subplebbit
                    databases
                  </Text>
                </Flex>
                <Flex
                  alignItems="flex-start"
                  marginTop="12px"
                  flexDir="column"
                  flexGrow="1"
                  justifyContent="flex-end"
                >
                  <Input
                    placeholder=" dataPath (optional)"
                    backgroundColor={mainBg}
                    color={mainColor}
                    boxSizing="border-box"
                    marginBottom="8px"
                    border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                    borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                    height="48px"
                    borderRadius="4px"
                    padding="12px 24px 4px 12px"
                    width="100%"
                    value={userProfile?.plebbitOptions?.dataPath}
                    onChange={() => {}}
                    onBlur={() => {}}
                    name="dataPath"
                    disabled
                  />
                </Flex>
              </Flex>
              <Flex
                justifyContent="space-between"
                borderBottom={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                alignItems="center"
              >
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  lineHeight="12px"
                  paddingBottom="6px"
                  marginBottom="32px"
                >
                  blockchainProviders
                </Text>
                <Button
                  fontSize="10px"
                  fontWeight="700"
                  lineHeight="12px"
                  paddingBottom="6px"
                  marginBottom="32px"
                  padding="8px"
                  borderRadius="3px"
                  onClick={onBlockOpen}
                >
                  add custom
                </Button>
              </Flex>
              {Object?.keys(userProfile?.plebbitOptions?.blockchainProviders || {})?.map((val) => (
                <Box key={val}>
                  <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                    <Flex justifyContent="space-between">
                      <Flex flexDir="column" marginRight="8px">
                        <Text
                          fontSize="16px"
                          fontWeight="500"
                          lineHeight="20px"
                          color={mainColor}
                          marginBottom="4px"
                        >
                          {val}
                        </Text>
                        <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                          ChainTicker of the provider RPC
                        </Text>
                      </Flex>
                      <Button
                        backgroundColor="red"
                        onClick={() =>
                          handleConfirm(
                            'Do you want to delete this Block Provider?',
                            handleDelete(val)
                          )
                        }
                      >
                        X
                      </Button>
                    </Flex>
                    <Flex
                      alignItems="flex-start"
                      marginTop="12px"
                      flexDir="column"
                      flexGrow="1"
                      justifyContent="flex-end"
                    >
                      <Input
                        placeholder="BlockchainProvider Chain Ticker"
                        backgroundColor={mainBg}
                        color={mainColor}
                        boxSizing="border-box"
                        marginBottom="8px"
                        border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                        borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                        height="48px"
                        borderRadius="4px"
                        padding="12px 24px 4px 12px"
                        width="100%"
                        value={val}
                        disabled
                        name={val}
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                    <Flex flexDir="column" marginRight="8px">
                      <Text
                        fontSize="16px"
                        fontWeight="500"
                        lineHeight="20px"
                        color={mainColor}
                        marginBottom="4px"
                      >
                        url
                      </Text>
                      <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                        URL of the provider RPC
                      </Text>
                    </Flex>
                    <Flex
                      alignItems="flex-start"
                      marginTop="12px"
                      flexDir="column"
                      flexGrow="1"
                      justifyContent="flex-end"
                    >
                      <Input
                        placeholder="BlockchainProvider Url"
                        backgroundColor={mainBg}
                        color={mainColor}
                        boxSizing="border-box"
                        marginBottom="8px"
                        border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                        borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                        height="48px"
                        borderRadius="4px"
                        padding="12px 24px 4px 12px"
                        width="100%"
                        value={userProfile?.plebbitOptions?.blockchainProviders[val]?.url}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            plebbitOptions: {
                              ...userProfile?.plebbitOptions,
                              blockchainProviders: {
                                ...userProfile?.plebbitOptions?.blockchainProviders,
                                [val]: {
                                  ...userProfile?.plebbitOptions?.blockchainProviders[val],
                                  url: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        ref={ref}
                        onBlur={() =>
                          setTimeout(async () => {
                            if (
                              userProfile?.plebbitOptions?.blockchainProviders[val]?.url !==
                              profile?.plebbitOptions?.blockchainProviders[val]?.url
                            ) {
                              try {
                                const res = await setAccount(userProfile);
                                logger('account:update', res);
                                toast({
                                  title: `changes saved`,
                                  variant: 'left-accent',
                                  status: 'success',
                                  isClosable: true,
                                });
                              } catch (error) {
                                logger('update-account', error, 'error');
                                toast({
                                  title: `Account update`,
                                  variant: 'left-update',
                                  description: error?.message,
                                  status: 'error',
                                  isClosable: true,
                                });
                              }
                            }
                          }, 300)
                        }
                        name="url"
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDir="column" flexFlow="row-wrap" marginBottom="32px">
                    <Flex flexDir="column" marginRight="8px">
                      <Text
                        fontSize="16px"
                        fontWeight="500"
                        lineHeight="20px"
                        color={mainColor}
                        marginBottom="4px"
                      >
                        chainId
                      </Text>
                      <Text fontWeight="400" color={metaColor} fontSize="12px" lineHeight="16px">
                        ID of the EVM chain if any
                      </Text>
                    </Flex>
                    <Flex
                      alignItems="flex-start"
                      marginTop="12px"
                      flexDir="column"
                      flexGrow="1"
                      justifyContent="flex-end"
                    >
                      <Input
                        placeholder="BlockchainProvider chainId"
                        backgroundColor={mainBg}
                        color={mainColor}
                        boxSizing="border-box"
                        marginBottom="8px"
                        border={`1px solid ${colorMode === 'light' ? '#edeff1' : '#343456'}`}
                        borderColor={colorMode === 'light' ? '#edeff1' : '#343456'}
                        height="48px"
                        borderRadius="4px"
                        padding="12px 24px 4px 12px"
                        width="100%"
                        type="number"
                        value={userProfile?.plebbitOptions?.blockchainProviders[val]?.chainId}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            plebbitOptions: {
                              ...userProfile?.plebbitOptions,
                              blockchainProviders: {
                                ...userProfile?.plebbitOptions?.blockchainProviders,
                                [val]: {
                                  ...userProfile?.plebbitOptions?.blockchainProviders[val],
                                  chainId: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        ref={ref}
                        onBlur={() =>
                          setTimeout(async () => {
                            if (
                              userProfile?.plebbitOptions?.blockchainProviders[val]?.chainId !==
                              profile?.plebbitOptions?.blockchainProviders[val]?.chainId
                            ) {
                              try {
                                const res = await setAccount(userProfile);
                                logger('account:update', res);

                                toast({
                                  title: `changes saved`,
                                  variant: 'left-accent',
                                  status: 'success',
                                  isClosable: true,
                                });
                              } catch (error) {
                                logger('update-account', error, 'error');
                                toast({
                                  title: `Account update`,
                                  variant: 'left-update',
                                  description: error?.message,
                                  status: 'error',
                                  isClosable: true,
                                });
                              }
                            }
                          }, 300)
                        }
                        name="chainId"
                      />
                    </Flex>
                  </Flex>
                  <hr
                    style={{
                      marginTop: '20px',
                      marginBottom: '20px',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Flex>
        )}
      </Box>
    </Layout>
  );
};

export default Settings;
