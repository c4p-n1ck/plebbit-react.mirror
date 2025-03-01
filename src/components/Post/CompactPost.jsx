import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Link,
  Skeleton,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  // BsBookmark,
  BsChat,
  BsChatSquare,
  BsEyeSlash,
  BsFileText,
  // BsPencil,
  BsPinAngleFill,
  BsShield,
} from 'react-icons/bs';
import { CgArrowsExpandLeft, CgCompressLeft } from 'react-icons/cg';
import { FiMoreHorizontal, FiExternalLink } from 'react-icons/fi';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { Link as ReactLink, useHistory } from 'react-router-dom';
import fromNow from '../../utils/formatDate';
import numFormatter from '../../utils/numberFormater';
import getUserName, { getSubName } from '../../utils/getUserName';
import Marked from '../Editor/marked';
import Avatar from '../Avatar';
import DropDown from '../DropDown';
import { HiLockClosed, HiOutlineCheckCircle } from 'react-icons/hi';
import { TiDeleteOutline } from 'react-icons/ti';

import { MdCheckBox, MdCheckBoxOutlineBlank, MdOutlineDeleteOutline } from 'react-icons/md';

const CompactPost = ({
  loading,
  setShowContent,
  showContent,
  vote,
  post,
  type,
  handleVoting,
  isOnline,
  subPlebbit,
  postVotes,
  handleOption,
  // setCopied,
  // location,
  // copied,
  pending,
  detailRoute,
  openRemovalModal,
  allowedSpecial,

  owner,
}) => {
  const mainBg = useColorModeValue('lightBody', 'darkBody');
  const subPlebbitSubTitle = useColorModeValue('metaTextLight', 'metaTextDark');
  const inactiveSubTitle = useColorModeValue('lightText', 'darkText1');
  const border2 = useColorModeValue('#edeff1', '#343536');
  const inputBg = useColorModeValue('lightInputBg', 'darkInputBg');
  const iconColor = useColorModeValue('lightIcon', 'darkIcon');
  const postTransBg = useColorModeValue('lightPostTransBg', 'darkPostTransBg');
  const voteColor = useColorModeValue('lightVoteText', 'darkVoteTest');
  const iconBg = useColorModeValue('lightIconBg', 'darkIconBg');
  const subPledditTextColor = useColorModeValue('bodyTextLight', 'bodyTextDark');
  const statusColor = useColorModeValue('lightVoteText', 'fff');
  const approveColor = useColorModeValue('pastelGreen', 'pastelGreen');
  const removeColor = useColorModeValue('persimmon', 'persimmon');
  const lockColor = useColorModeValue('brightSun', 'brightSun');
  const statusBg = useColorModeValue('rgb(237, 239, 241);', 'rgb(52, 53, 54)');
  const misCol = useColorModeValue('rgb(120, 124, 126)', 'rgb(129, 131, 132)');
  const history = useHistory();

  return (
    <Box
      color={iconColor}
      fill={iconColor}
      cursor="pointer"
      maxW="100%"
      bg={postTransBg}
      position="relative"
      border={`thin solid transparent`}
      _hover={{ border: '1px solid #898989' }}
    >
      <Flex alignItems="normal">
        {/* vote Bar */}
        <Flex>
          <Flex
            borderColor="transparent"
            boxSizing="border-box"
            borderLeftWidth="4px"
            borderLeftStyle="solid"
            flex="0 0 36px"
          >
            <Flex alignItems="center" margin="0" padding="0 2px" mt="9px">
              <Box
                width="24px"
                height="24px"
                bg="transparent"
                border="none"
                color="inherit"
                cursor="pointer"
                padding="initial"
                textAlign="center"
              >
                <Box
                  borderRadius="2px"
                  cursor="pointer"
                  display="inline-block"
                  overflow="hidden"
                  h="24px"
                  w="24px"
                  fontSize="16px"
                  lineHeight="24px"
                  _hover={{
                    bg: iconBg,
                    color: 'upvoteOrange',
                  }}
                  _focus={{
                    outline: 'none',
                  }}
                  onClick={() => {
                    handleVoting(vote === 1 ? 0 : 1);
                  }}
                  color={vote === 1 ? 'upvoteOrange' : iconColor}
                >
                  <Icon
                    width="20px"
                    height="20px"
                    fontSize="20px"
                    fontWeight="400"
                    as={vote === 1 ? ImArrowUp : BiUpvote}
                  />
                </Box>
              </Box>
              <Box
                color={voteColor}
                margin="0 1px"
                fontSize="12px"
                fontWeight="700"
                lineHeight="15px"
                pointerEvents="none"
                wordBreak="normal"
                textAlign="center"
                width="32px"
              >
                <Skeleton isLoaded={!loading}>
                  {postVotes === 0 ? 'vote' : numFormatter(postVotes)}
                </Skeleton>
              </Box>
              <Box
                textAlign="center"
                width="24px"
                height="24px"
                bg="transparent"
                border="none"
                color="inherit"
                cursor="pointer"
                padding="initial"
              >
                <Box
                  borderRadius="2px"
                  cursor="pointer"
                  color={vote === -1 ? 'downvoteBlue' : iconColor}
                  display="inline-block"
                  overflow="hidden"
                  h="24px"
                  w="24px"
                  fontSize="16px"
                  lineHeight="24px"
                  _hover={{
                    bg: iconBg,
                    color: 'downvoteBlue',
                  }}
                  _focus={{
                    outline: 'none',
                  }}
                  onClick={() => {
                    handleVoting(vote === -1 ? 0 : -1);
                  }}
                >
                  <Icon
                    width="20px"
                    height="20px"
                    fontSize="20px"
                    fontWeight="400"
                    as={vote === -1 ? ImArrowDown : BiDownvote}
                  />
                </Box>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Box
          bg={mainBg}
          borderLeft={`1px solid ${border2}`}
          flex="1 1 auto"
          minW="0"
          padding="3px 0"
          position="relative"
        >
          <Flex alignItems="center">
            {post?.content ? (
              <Link
                display="flex"
                flex="0 0 36px"
                margin="0 8px"
                alignSelf="center"
                alignItems="center"
                borderRadius="2px"
                justifyContent="center"
                height="36px"
                width="36px"
                _hover={{
                  bg: iconBg,
                }}
                onClick={() => setShowContent(!showContent)}
              >
                <Icon
                  as={showContent ? CgCompressLeft : CgArrowsExpandLeft}
                  position="absolute"
                  width="20px"
                  height="20px"
                  verticalAlign="middle"
                />
              </Link>
            ) : (
              <Box
                display="flex"
                flex="0 0 36px"
                margin="0 8px"
                alignSelf="center"
                alignItems="center"
                borderRadius="2px"
                justifyContent="center"
                height="36px"
                width="36px"
                _hover={{
                  bg: iconBg,
                }}
              >
                <Icon
                  as={BsFileText}
                  position="absolute"
                  width="20px"
                  height="20px"
                  verticalAlign="middle"
                />
              </Box>
            )}
            <Box flex="1 1 100%" mt="2px" minW="150px" overflow="hidden" wordWrap="break-word">
              {/* post title */}
              <Box margin="0 8px" onClick={() => history.push(detailRoute, [])}>
                <Skeleton display="flex" alignItems="center" flexWrap="wrap" isLoaded={!loading}>
                  {' '}
                  {/* flair */}
                  {type === 'subPlebbit' && post?.flair?.text ? (
                    <Tag
                      bg={post?.flair?.color}
                      mb="4px"
                      borderRadius="20px"
                      padding="2px 8px"
                      size="sm"
                      fontSize="12px"
                      fontWeight="500"
                      lineHeight="16px"
                      mr="5px"
                      ml="0"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      display="inline-block"
                      verticalAlign="text-bottom"
                    >
                      {post?.flair?.text}
                    </Tag>
                  ) : (
                    ''
                  )}
                  <Text
                    display="inline"
                    color={inactiveSubTitle}
                    fontSize="14px"
                    fontWeight="500"
                    lineHeight="18px"
                    paddingRight="5px"
                    textDecor="none"
                    wordBreak="break-word"
                    mb="4px"
                  >
                    {post?.title}
                    {!post?.content ? (
                      <Link
                        fontSize="12px"
                        fontWeight="400"
                        lineHeight="16px"
                        margin="4px 8px"
                        color="mainBlue"
                        href={post?.link}
                      >
                        <span>{post?.link.substring(0, 20) + '...'}</span>
                        <Icon
                          as={FiExternalLink}
                          verticalAlign="middle"
                          fontWeight="400"
                          width="20px"
                          height="20px"
                          fontSize="12px"
                          paddingLeft="4px"
                        />
                      </Link>
                    ) : (
                      ''
                    )}
                  </Text>
                  {type !== 'subPlebbit' && post?.flair?.text ? (
                    <Tag
                      bg={post?.flair?.backgroundColor}
                      color="#fff"
                      borderRadius="20px"
                      padding="2px 8px"
                      size="sm"
                      fontSize="12px"
                      fontWeight="500"
                      lineHeight="16px"
                      ml="5px"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      display="inline-block"
                      verticalAlign="text-bottom"
                      mb="4px"
                    >
                      {post?.flair?.text}
                    </Tag>
                  ) : (
                    ''
                  )}
                  {post?.spoiler && (
                    <Tag
                      borderRadius="2px"
                      p="1px 8px"
                      mr="5px"
                      variant="outline"
                      colorScheme="blackAlpha"
                    >
                      SPOILER
                    </Tag>
                  )}
                  {pending && (
                    <Skeleton isLoaded={!loading}>
                      <Tag size="sm" colorScheme="yellow" variant="outline">
                        Pending
                      </Tag>
                    </Skeleton>
                  )}
                </Skeleton>
              </Box>
              {/* Post head */}
              <Flex
                fontSize="12px"
                fontWeight="400"
                lineHeight="16px"
                flexFlow="row nowrap"
                alignItems="start"
                margin="0 8px 8px"
                position="relative"
              >
                <Skeleton mb="8px" isLoaded={!loading}>
                  <Flex alignItems="center" flexWrap="wrap" flex="1 1 auto" overflow="hidden">
                    <Flex
                      fontSize="12px"
                      fontWeight="400"
                      lineHeight="16px"
                      alignItems="center"
                      flexFlow="row wrap"
                    >
                      {type !== 'subPlebbit' ? (
                        <>
                          <Avatar
                            avatar={subPlebbit?.avatar}
                            width={24}
                            height={24}
                            mr="8px"
                            badge
                            isOnline={isOnline}
                          />
                          <Link
                            color={subPledditTextColor}
                            fontSize="12px"
                            fontWeight="700"
                            display="inline"
                            lineHeight="20px"
                            textDecoration="none"
                          >
                            {getSubName(subPlebbit)}
                          </Link>
                          <Box
                            verticalAlign="middle"
                            color={subPlebbitSubTitle}
                            fontSize="6px"
                            lineHeight="20px"
                            margin="0 4px"
                          />
                        </>
                      ) : (
                        <Link
                          as={ReactLink}
                          to={`/p/${post?.subplebbitAddress}`}
                          color={subPledditTextColor}
                          fontSize="12px"
                          fontWeight="700"
                          display="inline"
                          lineHeight="20px"
                          textDecoration="none"
                          mr="3px"
                        >
                          {getSubName(subPlebbit)}{' '}
                        </Link>
                      )}
                      <Text color={misCol} flex="0 0 auto" mr="3px">
                        Posted by
                      </Text>
                      {/* User Name */}
                      <Box display="inline-block" flex="0 0 auto">
                        <Box>
                          <Link
                            _hover={{
                              textDecoration: 'underline',
                            }}
                            color={misCol}
                            fontWeight="400"
                            mr="3px"
                            textDecor="none"
                            fontSize="12px"
                            lineHeight="16px"
                          >
                            {getUserName(post?.author)}
                          </Link>
                        </Box>
                      </Box>
                      {post?.author?.flair && (
                        <Box display="inline" verticalAlign="text-top">
                          <Text
                            bg={statusBg}
                            color={statusColor}
                            fontSize="12px"
                            fontWeight="500"
                            lineHeight="16px"
                            borderRadius="2px"
                            display="inline-block"
                            mr="5px"
                            overflow="hidden"
                            isTruncated
                            padding="0 4px"
                          >
                            {post?.author?.flair?.text}
                          </Text>
                        </Box>
                      )}
                      {/* date/time */}
                      <Tooltip
                        fontSize="10px"
                        label={post?.timestamp * 1000}
                        aria-label="date tooltip"
                        placement="top"
                      >
                        <Text
                          color={misCol}
                          mr="3px"
                          textDecor="none"
                          display="inline-block"
                          flex="0 0 auto"
                        >
                          {fromNow(parseInt(post?.timestamp * 1000))}
                        </Text>
                      </Tooltip>
                      {post?.pinned && <Icon as={BsPinAngleFill} color={approveColor} />}
                      {post?.locked && <Icon as={HiLockClosed} color={lockColor} />}
                      {post?.removed && (
                        <Flex
                          cursor="pointer"
                          color={removeColor}
                          alignItems="center"
                          onClick={() => (post?.moderatorReason ? openRemovalModal() : {})}
                        >
                          <Icon as={TiDeleteOutline} />
                          {!post?.moderatorReason ? (
                            allowedSpecial && <Box>Add A removal reason</Box>
                          ) : (
                            <Tooltip
                              fontSize="10px"
                              label="removal reason"
                              aria-label="removal reason"
                              placement="top"
                            >
                              <Text
                                color={misCol}
                                mr="3px"
                                textDecor="none"
                                display="inline-block"
                                flex="0 0 auto"
                              >
                                {post?.moderatorReason}
                              </Text>
                            </Tooltip>
                          )}
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Skeleton>
              </Flex>
            </Box>
            {/* Post Footer */}
            {pending ? (
              !loading && (
                /* <Flex
                  alignItems="center"
                  flex="0 0 72px"
                  justifyContent="flex-end"
                  height="100%"
                  ml="4px"
                  paddingRight="4px"
                >
                  <Flex
                    width="max-content"
                    borderRadius="2px"
                    fontSize="12px"
                    fontWeight="700"
                    lineHeight="16px"
                    padding="4px"
                    boxSizing="border-box"
                    _hover={{
                      bg: inputBg,
                    }}
                    onClick={() => handleOption('Edit')}
                    mr="4px"
                  >
                    <Icon
                      as={BsPencil}
                      width="20px"
                      height="20px"
                      verticalAlign="middle"
                      fontWeight="400"
                      mr="6px"
                    />
                  </Flex>
                  <Flex
                    width="max-content"
                    borderRadius="2px"
                    fontSize="12px"
                    fontWeight="700"
                    lineHeight="16px"
                    padding="4px"
                    boxSizing="border-box"
                    _hover={{
                      bg: inputBg,
                    }}
                    onClick={() => handleOption('Delete')}
                    mr="4px"
                  >
                    <Icon
                      as={TiDeleteOutline}
                      width="20px"
                      height="20px"
                      verticalAlign="middle"
                      fontWeight="400"
                      mr="6px"
                    />
                  </Flex>
                  <Flex
                    width="max-content"
                    borderRadius="2px"
                    fontSize="12px"
                    fontWeight="700"
                    lineHeight="16px"
                    padding="4px"
                    boxSizing="border-box"
                    _hover={{
                      bg: inputBg,
                    }}
                    mr="4px"
                  >
                    <Icon
                      as={BsBookmark}
                      width="20px"
                      height="20px"
                      verticalAlign="middle"
                      fontWeight="400"
                      mr="6px"
                    />
                  </Flex>
                </Flex> */
                <Box />
              )
            ) : allowedSpecial ? (
              <Flex
                alignItems="center"
                flex="0 0 72px"
                justifyContent="flex-end"
                height="100%"
                ml="4px"
                paddingRight="4px"
              >
                <ReactLink to={detailRoute}>
                  <Flex
                    padding="8px"
                    wordBreak="normal"
                    mr="4px"
                    alignItems="center"
                    borderRadius="2px"
                    fontSize="12px"
                    fontWeight="700"
                    lineHeight="16px"
                    boxSizing="border-box"
                    _hover={{
                      backgroundColor: inputBg,
                    }}
                  >
                    <Icon
                      as={BsChatSquare}
                      width="20px"
                      height="20px"
                      verticalAlign="middle"
                      fontWeight="400"
                      mr="6px"
                    />
                    <Text
                      display="inline-block"
                      lineHeight={1}
                      textTransform="capitalize"
                      verticalAlign="middle"
                    >
                      {post?.replyCount}
                    </Text>
                  </Flex>
                </ReactLink>
                {post?.removed ? (
                  <Flex
                    _hover={{
                      bg: inputBg,
                    }}
                    alignItems="center"
                    mr="4px"
                    margin="4px 8px 4px 0"
                    padding="4px"
                    borderRadius="2px"
                    cursor="pointer"
                    color={approveColor}
                    onClick={() => handleOption({ id: 'approved' })}
                  >
                    <Icon height="20px" width="20px" as={HiOutlineCheckCircle} />
                  </Flex>
                ) : (
                  <Flex
                    _hover={{
                      bg: inputBg,
                    }}
                    alignItems="center"
                    mr="4px"
                    margin="4px 8px 4px 0"
                    padding="4px"
                    borderRadius="2px"
                    cursor="pointer"
                    color={removeColor}
                    onClick={() => handleOption({ id: 'removed' })}
                  >
                    <Icon height="20px" width="20px" as={TiDeleteOutline} />
                  </Flex>
                )}

                <Flex justifyContent="center">
                  <DropDown
                    onChange={handleOption}
                    dropDownTitle={
                      <Flex
                        borderRadius="2px"
                        height="24px"
                        verticalAlign="middle"
                        padding="0 4px"
                        width="100%"
                        bg="transparent"
                        border="none"
                        alignItems="center"
                        _hover={{
                          backgroundColor: inputBg,
                        }}
                      >
                        <Icon as={BsShield} color={iconColor} h="20px" w="20px" />
                      </Flex>
                    }
                    options={[
                      {
                        label: 'Sticky Post',
                        icon: post?.pinned ? MdCheckBox : MdCheckBoxOutlineBlank,
                        id: 'pinned',
                      },
                      {
                        label: 'Lock Comments',
                        icon: post?.locked ? MdCheckBox : MdCheckBoxOutlineBlank,
                        id: 'locked',
                      },
                      {
                        label: 'Mark As Spoiler',
                        icon: post?.spoiler ? MdCheckBox : MdCheckBoxOutlineBlank,
                        id: 'spoiler',
                      },
                    ]}
                    rightOffset={0}
                    leftOffset="none"
                    topOffset="34px"
                  />
                </Flex>
                <Flex justifyContent="center">
                  <DropDown
                    onChange={handleOption}
                    dropDownTitle={
                      <Flex
                        borderRadius="2px"
                        height="24px"
                        verticalAlign="middle"
                        padding="0 4px"
                        width="100%"
                        bg="transparent"
                        border="none"
                        alignItems="center"
                        _hover={{
                          backgroundColor: inputBg,
                        }}
                      >
                        <Icon as={FiMoreHorizontal} color={iconColor} h="20px" w="20px" />
                      </Flex>
                    }
                    options={[
                      {
                        label: 'Block Author',
                        icon: BsEyeSlash,
                        id: 'block',
                        disabled: owner,
                      },
                      {
                        label: 'Delete',
                        icon: MdOutlineDeleteOutline,
                        id: 'delete',
                        disabled: !owner,
                      },
                    ]}
                    rightOffset={0}
                    leftOffset="none"
                    topOffset="34px"
                  />
                </Flex>
              </Flex>
            ) : (
              <Flex
                alignItems="center"
                flex="0 0 72px"
                justifyContent="flex-end"
                height="100%"
                ml="4px"
                paddingRight="4px"
              >
                <Link
                  width="max-content"
                  borderRadius="2px"
                  fontSize="12px"
                  fontWeight="700"
                  lineHeight="16px"
                  padding="4px"
                  boxSizing="border-box"
                  _hover={{
                    bg: inputBg,
                  }}
                  onClick={() => history.push(detailRoute, [])}
                >
                  <Icon
                    as={BsChat}
                    width="20px"
                    height="20px"
                    verticalAlign="middle"
                    fontWeight="400"
                    mr="6px"
                  />
                  <span>{post?.replyCount}</span>
                </Link>
                <Flex justifyContent="center">
                  <DropDown
                    onChange={handleOption}
                    rightOffset={0}
                    leftOffset="unset"
                    dropDownTitle={
                      <Flex
                        borderRadius="2px"
                        height="24px"
                        verticalAlign="middle"
                        padding="0 4px"
                        width="100%"
                        bg="transparent"
                        border="none"
                        alignItems="center"
                        _hover={{
                          backgroundColor: inputBg,
                        }}
                      >
                        <Icon as={FiMoreHorizontal} color={iconColor} h="20px" w="20px" />
                      </Flex>
                    }
                    options={[
                      {
                        label: 'Block Author',
                        icon: BsEyeSlash,
                        id: 'block',
                        disabled: owner,
                      },
                      {
                        label: 'Delete',
                        icon: MdOutlineDeleteOutline,
                        id: 'delete',
                        disabled: !owner,
                      },
                    ]}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
      {showContent ? (
        <Box bg={mainBg} height="100%">
          <Box padding="5px 16px 5px 8px" maxWidth="800px">
            <Box
              color={voteColor}
              fontSize="14px"
              fontWeight="400"
              lineHeight="21px"
              wordBreak="break-word"
              overflow="auto"
              paddingBottom="1px"
              marginBottom="-1px"
            >
              <Marked content={post?.content} />
            </Box>
          </Box>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
};

export default CompactPost;
