import { Avatar as Av, AvatarBadge } from '@chakra-ui/react';
import React from 'react';
import { PlebLogo } from '../svgs';

const Avatar = (props) => {
  const { badge, avatar, borderWidth = '2px', width, height, isOnline } = props;
  return (
    <>
      {badge ? (
        <Av icon={<PlebLogo />} {...props} width={`${width}px`} height={`${height}px`} src={avatar}>
          <AvatarBadge
            borderWidth={borderWidth}
            borderColor="#fff"
            boxSize="50%"
            bg={isOnline ? '#46d160' : 'red'}
            bottom={borderWidth}
            right={borderWidth}
          />
        </Av>
      ) : (
        <Av
          {...props}
          icon={<PlebLogo />}
          width={`${width}px`}
          height={`${height}px`}
          src={avatar}
        />
      )}
    </>
  );
};

export default Avatar;
