import { TestBed } from '@angular/core/testing';

import { DBconexion } from './dbconexion';

describe('DBconexion', () => {
  let service: DBconexion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBconexion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
