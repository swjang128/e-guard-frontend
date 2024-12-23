export type MenuEntity = {
  menuId: number;
  menuName: string;
  menuUrl: string;
  menuDescription: string;
  menuAvailable: true;
  parentId: null | number;
  children: null | MenuEntity[];
  menuDepth: number;
  accessibleRoles: string[];
  createdAt: string;
  updatedAt: string;
};

// pick Entity
export type UsableMenuEntity = Pick<
  MenuEntity,
  | 'menuId'
  | 'menuName'
  | 'menuUrl'
  | 'parentId'
  | 'accessibleRoles'
  | 'menuDepth'
  | 'children'
>;
