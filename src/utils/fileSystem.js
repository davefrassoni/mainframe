const FS_KEY = 'mainframe_fs';

const defaultFS = {
  '/': {
    type: 'dir',
    children: {
      'USER': {
        type: 'dir',
        children: {
          'ADMIN': {
            type: 'dir',
            children: {
              'JCL.LIB': {
                type: 'dir',
                children: {
                  'BACKUP': { type: 'file', content: '//BACKUP JOB (1234),\'ADMIN\',CLASS=A\n//STEP1 EXEC PGM=IEBCOPY\n//...' },
                  'CLEANUP': { type: 'file', content: '//CLEANUP JOB (1234),\'ADMIN\',CLASS=A\n//...' }
                }
              },
              'NOTES.TXT': { type: 'file', content: 'Remember to check the IPL logs.' }
            }
          }
        }
      },
      'SYS1': {
        type: 'dir',
        children: {
          'PARMLIB': {
            type: 'dir',
            children: {
              'IEASYS00': { type: 'file', content: 'PROD SYSTEM CONFIG' }
            }
          }
        }
      }
    }
  }
};

export const initFS = () => {
  if (!localStorage.getItem(FS_KEY)) {
    localStorage.setItem(FS_KEY, JSON.stringify(defaultFS));
  }
};

const getFS = () => {
  const fs = localStorage.getItem(FS_KEY);
  return fs ? JSON.parse(fs) : defaultFS;
};

const saveFS = (fs) => {
  localStorage.setItem(FS_KEY, JSON.stringify(fs));
};

export const listDir = (absPath) => {
  const fs = getFS();
  // Traverse
  if (absPath === '/') {
    return Object.keys(fs['/'].children).map(name => {
      const node = fs['/'].children[name];
      return { name, type: node.type };
    });
  }

  const parts = absPath.split('/').filter(p => p);
  let current = fs['/'];
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children[part]) return null;
    current = current.children[part];
  }

  if (current.type !== 'dir') return null;

  return Object.keys(current.children).map(name => {
    const node = current.children[name];
    return { name, type: node.type };
  });
};

export const readFile = (absPath) => {
  const fs = getFS();
  const parts = absPath.split('/').filter(p => p);
  let current = fs['/'];

  for (const part of parts) {
    if (current.children && current.children[part]) {
      current = current.children[part];
    } else {
      return null;
    }
  }

  if (current.type !== 'file') return null;
  return current.content;
};

export const writeFile = (absPath, content) => {
  const fs = getFS();
  const parts = absPath.split('/').filter(p => p);
  const fileName = parts.pop();
  let current = fs['/'];

  for (const part of parts) {
    if (!current.children[part]) {
      // Auto-create directories (mkdir -p behavior generic)
      current.children[part] = { type: 'dir', children: {} };
    }
    current = current.children[part];
  }

  if (current.type !== 'dir') return false;

  current.children[fileName] = { type: 'file', content };
  saveFS(fs);
  return true;
};

export const createDir = (absPath) => {
  const fs = getFS();
  const parts = absPath.split('/').filter(p => p);
  let current = fs['/'];

  for (const part of parts) {
    if (!current.children[part]) {
      current.children[part] = { type: 'dir', children: {} };
    }
    current = current.children[part];
  }
  saveFS(fs);
  return true;
};

export const deletePath = (absPath) => {
  const fs = getFS();
  const parts = absPath.split('/').filter(p => p);
  const target = parts.pop();
  let current = fs['/'];

  for (const part of parts) {
    if (!current.children[part]) return false;
    current = current.children[part];
  }

  if (current.children[target]) {
    delete current.children[target];
    saveFS(fs);
    return true;
  }
  return false;
};
