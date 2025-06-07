'use client';

import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

type AppAbility = MongoAbility;

export function useAbility() {
  const { user } = useAuth();
  const [ability, setAbility] = useState<AppAbility>(defineAbility());

  useEffect(() => {
    if (user) {
      setAbility(defineAbility(user));
    } else {
      setAbility(defineAbility());
    }
  }, [user]);

  return ability;
}

function defineAbility(user?: any) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  
  if (user) {
    can('read', 'User');
    
    if (user.role === 'admin') {
      can('manage', 'all');
    }
    
    if (user.role === 'manager') {
      can('read', 'all');
      can('create', 'Task');
      can('update', 'Task');
    }
  }
  
  return build();
}