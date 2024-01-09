import time


class MemoryCache(object):

    _storage = None

    @classmethod
    def get_cache(cls):
        if not cls._storage:
            cls._storage = MemoryCache()
        return cls._storage

    def set(self, key, item, ttl=60):
        self.__dict__[key] = (item, time.time() + ttl)

    def get(self, key):

        try:
            item, t = self.__dict__[key]

            if time.time() < t:
                return item
            else:
                del self.__dict__[key]
                return None
        except KeyError:
            return None

    def __repr__(self):
        return repr(self.__dict__)
