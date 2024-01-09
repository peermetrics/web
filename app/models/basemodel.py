from django.db import models
from django.core.exceptions import ValidationError

from ..errors import PMError, INVALID_PARAMETERS
from ..logger import log


class BaseModel(models.Model):

    class Meta:
        abstract = True

    def set_values(self, values):
        changed = False
        for key, value in values:
            if value is not None and getattr(self, key) != value:
                self.__setattr__(key, value)
                changed = True
        return changed

    def save(self, *args, **kwargs):
        try:
            self.clean_fields()
        except ValidationError as exc:
            log.warning(exc)
            raise PMError(
                status=400,
                app_error=INVALID_PARAMETERS,
            )

        super().save(*args, **kwargs)

    def soft_delete(self):
        self.is_active = False
        self.save()

    @classmethod
    def get(cls, *args, **kwargs):
        kwargs['is_active'] = True
        obj = cls.objects.get(*args, **kwargs)

        obj.prepare()

        return obj

    @classmethod
    def get_or_create(cls, *args, **kwargs):
        kwargs['is_active'] = True
        obj, created = cls.objects.get_or_create(*args, **kwargs)
        if not created:
            obj.prepare()

        return obj, created

    @classmethod
    def filter(cls, *args, **kwargs):
        kwargs['is_active'] = True
        filtered = cls.objects.filter(*args, **kwargs)
        filtered.exists()

        for obj in filtered:
            obj.prepare()

        return filtered

    def prepare(self):
        """
        Base method to be called before returning an object from db. Overridden in subclasses.
        """
        pass

    def get_url(self):
        pass

    def get_name(self):
        pass

    @staticmethod
    def get_type():
        pass
