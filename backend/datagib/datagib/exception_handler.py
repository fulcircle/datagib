import logging


class ExceptionHandler:

    def __init__(self):
        self.logger = logging.getLogger(__name__)

        try:
            import sentry_sdk
            self.sentry_sdk = sentry_sdk
        except ImportError:
            self.sentry = None

    def handle_exception(self, e):
        self.logger.exception(e)
        self.sentry_capture(e)

    def sentry_capture(self, e):
        if self.sentry_sdk is not None:
            self.sentry_sdk.capture_exception(e)
