import React, { useContext, useEffect, useState } from 'react';
import { Box, Flex, Icon, Image, useColorModeValue, useToast } from '@chakra-ui/react';
import Button from '../../components/Button';
import { FaBell } from 'react-icons/fa';
import { ProfileContext } from '../../store/profileContext';
import Post from '../../components/Post';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreatePostBar from '../../components/Post/CreatePost/createPostBar';
import FeedSort from '../../components/Post/FeedSort';
import { useAccountsActions, useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Link } from 'react-router-dom';
import SideBar from './sideBar';
import getChallengeAnswersFromUser from '../../utils/getChallengeAnswersFromUser';

const SubPlebbit = ({ match }) => {
  const { postStyle, feedSort, profile, subscriptions, device } = useContext(ProfileContext);
  const mainBg = useColorModeValue('lightBody', 'darkBody');
  const pseuBg = useColorModeValue('#DAE0E6', '#030303');
  const subPlebbitSubTitle = useColorModeValue('metaTextLight', 'metaTextDark');
  const subPlebbitBorder = useColorModeValue('borderLight1', 'borderDark1');
  // const inactiveSubTitle = useColorModeValue('lightText1', 'darkText1');
  const { feed, loadMore, hasMore } = useFeed([match?.params?.subplebbitAddress], feedSort);
  const subPlebbit = useSubplebbit(match?.params?.subplebbitAddress);
  const feeds = feed;
  const [data, setData] = useState({ ...subPlebbit });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const { publishSubplebbitEdit, subscribe, unsubscribe } = useAccountsActions();

  useEffect(() => {
    setData({ ...subPlebbit });
  }, [subPlebbit]);

  const onChallengeVerification = (challengeVerification, subplebbitEdit) => {
    // if the challengeVerification fails, a new challenge request will be sent automatically
    // to break the loop, the user must decline to send a challenge answer
    // if the subplebbit owner sends more than 1 challenge for the same challenge request, subsequents will be ignored
    toast({
      title: 'Accepted.',
      description: 'Action accepted',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setLoading(false);
    console.log('challenge verified', challengeVerification, subplebbitEdit);
  };

  const onChallenge = async (challenges, subplebbitEdit) => {
    let challengeAnswers = [];
    try {
      // ask the user to complete the challenges in a modal window
      challengeAnswers = await getChallengeAnswersFromUser(challenges);
    } catch (error) {
      // if  he declines, throw error and don't get a challenge answer
      console.log(error);
      toast({
        title: 'Declined.',
        description: 'Action Declined',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    if (challengeAnswers) {
      await subplebbitEdit.publishChallengeAnswers(challengeAnswers);
    }
  };

  const handleSubscribe = async () => {
    setSubLoading(true);
    await subscribe(subPlebbit?.address);
    toast({
      title: 'Subscribed.',
      description: 'Joined successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const handleUnSubscribe = async () => {
    setSubLoading(true);
    await unsubscribe(subPlebbit?.address);

    toast({
      title: 'Unsubscribed.',
      description: 'Unsubscribed successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    await publishSubplebbitEdit(subPlebbit?.address, {
      ...data,
      onChallenge,
      onChallengeVerification,
    });
  };

  return (
    <Flex flexDirection="column" minH="calc(100vh - 48px)">
      <Box
        minH="100%"
        overflow="hidden"
        position="relative"
        flex="none"
        _after={{
          content: `" "`,
          position: 'fixed',
          height: '100%',
          top: '0',
          left: '0',
          backgroundColor: pseuBg,
          willChange: 'transform',
        }}
      />
      <Box zIndex="3">
        <Link to={`/p/${subPlebbit?.address}`}>
          <Flex
            backgroundColor="rgb(51, 168, 255)"
            filter="none"
            height="64px"
            padding="8px 16px"
            margin="0 auto"
            minW="260px"
          />
        </Link>
        <Box backgroundColor={mainBg} width="100%">
          <Flex
            maxWidth="984px"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="space-between"
            margin="0 auto"
            padding="0 16px 0 24px"
          >
            <Flex
              marginTop="-14px"
              marginBottom="12px"
              alignItems={device !== 'mobile' ? 'flex-start' : 'center'}
              flexDir={device !== 'mobile' ? 'row' : 'column'}
            >
              <Image
                fallbackSrc={require('../../assets/images/fallback.png')}
                src=""
                backgroundColor="#fff"
                backgroundSize="cover"
                borderRadius="100%"
                border="4px solid #fff"
                display="inline-block"
                height="76px"
                width="76px"
              />
              <Flex
                boxSizing="border-box"
                alignContent="flex-start"
                flexDirection={device !== 'mobile' ? 'row' : 'column'}
                flex="1"
                paddingLeft="16px"
                marginTop="24px"
                justifyContent={device !== 'mobile' ? 'space-between' : 'center'}
                width={device !== 'mobile' ? '"calc(100% - 80px)"' : '100%'}
              >
                <Box paddingRight="24px" box-sizing="border-box">
                  <Box
                    fontSize="28px"
                    fontWeight="700"
                    lineHeight="32px"
                    padding="0 2px 4px 0"
                    width="100%"
                  >
                    {subPlebbit?.title || subPlebbit?.address}
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="500"
                    lineHeight="18px"
                    color={subPlebbitSubTitle}
                    wordBreak="break-all"
                  >
                    p/{subPlebbit?.address}
                  </Box>
                </Box>
                <Flex alignItems="center" mt="10px">
                  <Box width="96px">
                    <Button
                      bg="transparent"
                      content={subscriptions?.includes(subPlebbit?.address) ? 'Joined' : 'Join'}
                      padding="4px 16px"
                      minW="32px"
                      minH="32px"
                      loading={subLoading}
                      onClick={
                        subscriptions?.includes(subPlebbit?.address)
                          ? handleUnSubscribe
                          : handleSubscribe
                      }
                    />
                  </Box>
                  <Box>
                    <Button
                      content={
                        <Icon verticalAlign="middle" width="20px" height="20px" as={FaBell} />
                      }
                      padding="5px"
                      borderRadius="100%"
                      height="32px"
                      width="33px"
                      bg="transparent"
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
            <Box
              position="static"
              bg="inherit"
              marginLeft="-16px"
              marginTop="-4px"
              bottom="0"
              right="0"
              left="0"
            >
              <Flex
                maxW="1200px"
                padding="0 16px"
                alignItems="center"
                justifyContent="space-between"
                margin="0 auto"
                minW="260px"
              >
                <Box>
                  <Box
                    borderBottom={`3px solid`}
                    borderColor={subPlebbitBorder}
                    paddingBottom="1px"
                    fontSize="14px"
                    fontWeight="500"
                    lineHeight="18px"
                    margin="0 5px"
                    paddingLeft="8px"
                    paddingRight="8px"
                    paddingTop="4px"
                    ml="0"
                  >
                    Posts
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Flex maxW="100%" padding="20px 24px" justifyContent="center" margin="0 auto">
          <Box width={postStyle === 'card' ? '640px' : '100%'} minWidth="0">
            {/* Create Post Bar */}
            <CreatePostBar />
            {/* feed sort bar */}
            <FeedSort />
            {/* feed list */}

            <Box minHeight="1000px" width="100%">
              <InfiniteScroll
                dataLength={feeds ? feeds.length : 0}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <Post type="subPlebbit" loading={true} mode={postStyle} key={Math.random()} />
                }
                // below props only if you need pull down functionality
                refreshFunction={() => {}}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                  <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                  <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                }
              >
                {feeds?.map((feed) => (
                  <Post type="subPlebbit" post={feed} key={feed?.cid} mode={postStyle} />
                ))}
              </InfiniteScroll>
            </Box>
          </Box>
          {/* side bar */}
          <SideBar
            profile={profile}
            handleSaveChanges={handleSaveChanges}
            loading={loading}
            data={data}
            setData={setData}
            subPlebbit={subPlebbit}
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default SubPlebbit;
